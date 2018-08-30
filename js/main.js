import _THREE from './libs/_Global.js'
import './base/MTLLoader.js'
import './base/OBJLoader.js'

import index from './view/index.js'
import logind from './view/loading.js'
import gameOver from './view/gameOver.js'
import game2D from './view/game2D.js'

import { Car } from './car.js'
import audio from './audio.js'

GameGlobal.THREE = _THREE;

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

        // 游戏状态变量
        this.status = {
            Totaltime: 180000, // 总时间
            hp: 100,// 生命值
        }

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

        // 场景
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
        var webGLRenderer = new THREE.WebGLRenderer(context);
        webGLRenderer.setPixelRatio(window.devicePixelRatio);
        webGLRenderer.setSize(screenWidth, screenHeight);
        webGLRenderer.setClearColor(0x0077ec, 1);
        webGLRenderer.shadowMap.enabled = true;
        webGLRenderer.shadowMap.type = THREE.PCFShadowMap;
        this.webGLRenderer = webGLRenderer;

        // 平行光
        var pointLight = new THREE.PointLight(0xccbbaa, 1, 0, 0);
        this.pointLight = pointLight;
        pointLight.position.set(-10, 20, -20);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        // 点光源
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
            var objLoader = new THREE.OBJLoader();
            self.logindUI.update("加载地形中...");
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

            }, function () {
                console.log('progress');
            }, function () {
                console.log('error');
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
        requestAnimationFrame(this.update.bind(this));
        this.car.tick();
        this.webGLRenderer.render(this.scene, this.camera);
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
    }

    // 游戏结束
    gameover = (score) => {
        if (!!score) wx.postMessage({ type: 1, data: { score: Number(score) }, style: { top: screenHeight / 4, left: screenWidth / 4 } })

        this.gameoverUI.over();
        this.game2DUI.delete();

        this.canvasPool = [this.gameCanvas, this.gameoverUI.canvas, sharedCanvas];// 更新画布池
    }

    // 游戏控制
    control = (type) => {
        let car = this.car;

    }

}