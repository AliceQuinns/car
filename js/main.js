import * as THREE from './libs/three.js'
import './base/MTLLoader.js'
import './base/OBJLoader.js'

import index from './view/index.js'
import logind from './view/loading.js'
import gameOver from './view/gameOver.js'
import game2D from './view/game2D.js'

import Car from './car.js'
import audio from './audio.js'

let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
let ratio = wx.getSystemInfoSync().pixelRatio;

// 主屏canvas
canvas.width = screenWidth * ratio;
canvas.height = screenHeight * ratio;
var mainCanvas = canvas.getContext("2d");
mainCanvas.scale(ratio, ratio);

export default class Main {
    constructor() {
        this.canvasPool = [];// 画布池

        this.indexUI = new index(this);
        this.logindUI = new logind(this);
        this.gameoverUI = new gameOver(this);
        this.game2DUI = new game2D(this);
        this.audio = new audio(this);

        this.renderPool();// canvas渲染逻辑

        this.init();

        this.global();// 调试接口
    }

    renderPool() {
        requestAnimationFrame(this.renderPool.bind(this));
        mainCanvas.clearRect(0, 0, screenWidth, screenHeight);
        this.canvasPool.forEach(item => {
            if (!!item) {
                mainCanvas.drawImage(item, 0, 0, screenWidth, screenHeight);
            }
        })
    }

    init() {

        this.logindUI.update("正在创建3D场景...");
        this.canvasPool.push(this.logindUI.canvas);

        // 场景与天空盒
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.CubeTextureLoader()
            .setPath('https://shop.yunfanshidai.com/xcxht/racing/assets/images/skybox/')
            .load([
                'right.png', 'left.png',
                'top.png', 'back.png',
                'front.png', 'back.png'
            ]);

        // 摄像机
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 0;
        this.camera.position.x = 0;
        this.camera.speed = {
            z: 0,
            x: 0
        };

        // 游戏画布
        this.gameCanvas = wx.createCanvas();
        var context = this.gameCanvas.getContext('webgl');

        // 渲染器
        var webGLRenderer = new THREE.WebGLRenderer({
            canvas: this.gameCanvas,
            context: context
        });
        webGLRenderer.setPixelRatio(window.devicePixelRatio);
        webGLRenderer.setSize(screenWidth, screenHeight);
        webGLRenderer.setClearColor(0x0077ec, 1);
        webGLRenderer.shadowMap.enabled = true;
        webGLRenderer.shadowMap.type = THREE.PCFShadowMap;
        this.webGLRenderer = webGLRenderer;

        // 点光源
        var pointLight = new THREE.PointLight(0xccbbaa, 1, 0, 0);
        this.pointLight = pointLight;
        pointLight.position.set(-10, 20, -20);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        // 环境光
        this.light = new THREE.AmbientLight(0xccbbaa, 0.1);
        this.scene.add(this.light);

        // 游戏对象渲染
        this.Render();
    }

    // 游戏对象
    Render() {
        let self = this;

        // 赛道模型渲染
        let Ground = () => {
            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.setPath('https://shop.yunfanshidai.com/xcxht/racing/assets/');
            mtlLoader.load('ground.mtl', function (materials) {
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath('https://shop.yunfanshidai.com/xcxht/racing/assets/');
                objLoader.load('ground.obj', function (object) {

                    object.children.forEach(function (item) {
                        item.receiveShadow = true;
                    });
                    object.position.y = -5;
                    self.scene.add(object);

                    // 资源加载完毕
                    self.logindUI.delete();
                    self.indexUI.render();

                    self.canvasPool = [self.gameCanvas, self.indexUI.canvas];// 更新画布池

                    self.audio.onBGM();
                    self.update();
                }, function (xhr) {
                    console.log('progress');
                }, function () {
                    console.log('error');
                });
            });
        }

        // 汽车模型
        this.car = new Car({
            scene: self.scene,
            cb: () => { self.ground = new Ground() },
            light: self.pointLight,
            camera: self.camera,
            ctx: self
        });

    }

    // 游戏主渲染逻辑
    update() {
        this.car.tick();
        this.webGLRenderer.render(this.scene, this.camera);
        requestAnimationFrame(this.update.bind(this), this.gameCanvas);
    }

    global() {
        GameGlobal.camera = this.camera;
        GameGlobal.scene = this.scene;
        GameGlobal.pointLight = this.pointLight;
        GameGlobal.ctx = this;
        GameGlobal.audio = this.audio;
    }

    // 游戏开始
    gamestart = () => {
        this.indexUI.delete();
        this.game2DUI.render();
        this.canvasPool = [this.gameCanvas, this.game2DUI.canvas];
        let m = 0, s = 0, ms = 0;
        if (!!this.GameTime) window.clearInterval(this.GameTime);
        // 游戏时间与速度
        this.GameTime = window.setInterval(() => {
            ms += 1;
            if (ms >= 100) {
                ms = 0;
                s += 1;
            }
            if (s >= 60) {
                s = 0;
                m += 1;
            }
            ctx.game2DUI.update(`${m}:${s}:${ms}`, Math.round(this.car.speed * 60));
            this.score = s;
        }, 10);
        this.car.run = true;// 启动汽车
        this.audio.onBGM("close");
    }

    // 游戏结束
    gameover = () => {
        wx.postMessage({ type: 1, data: { score: Number(this.score) }, style: { top: screenHeight / 4, left: screenWidth / 4 } })

        this.gameoverUI.over();
        this.game2DUI.delete();

        this.car.run = false;// 停止汽车

        this.canvasPool = [this.gameCanvas, this.gameoverUI.canvas, sharedCanvas];// 更新画布池

        if (!!this.GameTime) window.clearInterval(this.GameTime);
    }

    // 游戏控制
    control = (type) => {
        let car = this.car;
        if (type === "left") {
            car.rSpeed = 0.02;
            car.brake();
        } else if (type === "right") {
            car.rSpeed = -0.02;
            car.brake();
        } else if (type === "stop") {
            car.rSpeed = 0;
            car.cancelBrake();
        }
    }

}