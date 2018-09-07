import * as THREE from './libs/three.min.js'
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

GameGlobal.THREE = THREE;
GameGlobal.ImageBitmap = function () { }

export default class Main {
    camera = null
    scene = null
    renderer = null
    light = null

    constructor() {
        this.initRender()
        this.initScene()
        this.initCamera()
        this.initLight()
        this.render()

        this.indexUI = new index(this);
        // this.logindUI = new logind(this);
        this.gameoverUI = new gameOver(this);
        this.game2DUI = new game2D(this);
        this.sharedUI = new shared(this);
        this.audio = new audio(this);

        GameGlobal.ctx = this;
    }

    initRender() {
        var renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(screenWidth, screenHeight);
        renderer.setClearColor(0x0077ec, 1);
        // renderer.shadowMap.enabled = true;
        // renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer = renderer;
    }

    updata() {
        requestAnimationFrame(this.updata.bind(this));
        this.car.tick();
        this.renderer.render(this.scene, this.camera);
    }

    initScene() {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.CubeTextureLoader()
            .setPath('https://shop.yunfanshidai.com/xcxht/racing/assets/images/skybox/')
            .load([
                'right.png', 'left.png',
                'top.png', 'back.png',
                'front.png', 'back.png'
            ]);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 0;
        this.camera.position.x = 0;
        this.camera.position.y = 2;
        this.camera.speed = {
            z: 0,
            x: 0
        };
    }

    initLight() {
        this.light = new THREE.DirectionalLight(0xffffff)
        this.light.position.set(20, 10, 5)
        this.scene.add(this.light)

        var pointLight = new THREE.PointLight(0xccbbaa, 1, 0, 0);
        this.pointLight = pointLight;
        pointLight.position.set(-10, 20, -20);
        pointLight.castShadow = true;
        this.scene.add(pointLight);
    }

    render() {
        let self = this;

        // 汽车
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('https://shop.yunfanshidai.com/xcxht/racing/assets/car/car2/');
        mtlLoader.load('car2.mtl', function (material) {
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(material);
            objLoader.setPath('https://shop.yunfanshidai.com/xcxht/racing/assets/car/car2/');
            objLoader.load('car2.obj', function (object) {
                self.scene.add(object);
                self.indexUI.render();
                // object.children.forEach(function (item) {
                //     item.castShadow = true;// 渲染阴影映射
                // });
                object.position.z = -20;
                object.position.y = -4;
                self.car = new Car({
                    scene: self.scene,
                    light: self.pointLight,
                    camera: self.camera,
                    ctx: self,
                    car: object
                });
                self.updata();
                // self.logindUI.delete();
            })
        });

        // 赛道
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('https://shop.yunfanshidai.com/xcxht/racing/assets/');

        mtlLoader.load('ground.mtl', function (material) {
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(material);
            objLoader.setPath('https://shop.yunfanshidai.com/xcxht/racing/assets/');
            objLoader.load('ground.obj', function (object) {
                // object.children.forEach(function (item) {
                //     item.receiveShadow = true;
                // });
                object.position.y = -5;
                self.scene.add(object);

                self.audio.onBGM();
            })
        });
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
      // ctx.game2DUI.update(`${m}:${s}:${ms}`, Math.round(this.car.speed * 60));
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