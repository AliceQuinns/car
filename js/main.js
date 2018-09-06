import * as THREE from './libs/three.js'
import './base/MTLLoader.js'
import './base/OBJLoader.js'

import index from './view/index.js'
import logind from './view/loading.js'
import gameOver from './view/gameOver.js'
import game2D from './view/game2D.js'
import shared from './view/sharedCanvas.js'

import Car from './car.js'
import audio from './audio.js'

let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;

export default class Main {
    constructor() {
        GameGlobal.THREE = THREE;

        this.indexUI = new index(this);
        this.logindUI = new logind(this);
        this.gameoverUI = new gameOver(this);
        this.game2DUI = new game2D(this);
        this.sharedUI = new shared(this);

        this.audio = new audio(this);

        this.init();
        this.global();// 调试接口
    }

    init() {
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

        // 渲染器
        var webGLRenderer = new THREE.WebGLRenderer({
            canvas: canvas
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

        // 加载页面
        this.logindUI.update("正在创建3D场景...");

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

                    self.logindUI.delete();
                    self.indexUI.render();

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
        requestAnimationFrame(this.update.bind(this));
        // this.car.car.rotateY(0.01);
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
        this.car.run = false;// 停止汽车
        if (!!this.GameTime) window.clearInterval(this.GameTime);

        wx.postMessage({ type: 1, data: { score: Number(this.score) }, style: { top: screenHeight / 4, left: screenWidth / 4 } })

        this.gameoverUI.over();
        this.game2DUI.delete();
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