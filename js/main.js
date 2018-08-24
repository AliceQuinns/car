import _THREE from './libs/_Global.js'
import './base/MTLLoader.js'
import './base/OBJLoader.js'

import index from './view/index.js'
import logind from './view/loading.js'
import { Car } from './car.js'

GameGlobal.THREE = _THREE

export default class Main {
    constructor() {
        this.THREE = THREE;
        this.scene;
        this.camera;
        this.gameStatus = false; // 游戏状态

        this.indexIU = new index(this);
        this.init();
        this.event();
    }
    init() {
        let self = this;
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        GameGlobal.camera = this.camera;
        this.camera.position.z = 0;
        this.camera.position.x = 0;
        this.camera.speed = {
            z: 0,
            x: 0
        };

        var context = canvas.getContext('webgl');
        var webGLRenderer = new THREE.WebGLRenderer(context);

        webGLRenderer.setPixelRatio(window.devicePixelRatio);
        webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        webGLRenderer.setClearColor(0x0077ec, 1);
        webGLRenderer.shadowMap.enabled = true;
        webGLRenderer.shadowMap.type = THREE.PCFShadowMap;

        var pointLight = new THREE.PointLight(0xccbbaa, 1, 0, 0);
        pointLight.position.set(-10, 20, -20);
        pointLight.castShadow = true;

        this.scene.add(pointLight);

        var light = new THREE.AmbientLight(0xccbbaa, 0.1);
        this.scene.add(light);

        new logind(this);

        // 地面
        function Ground() {
            var meshBasicMaterial = new THREE.MeshLambertMaterial({
                color: 0xff0000,
                side: THREE.DoubleSide
            });

            var objLoader = new THREE.OBJLoader();

            objLoader.setPath('https://shop.yunfanshidai.com/xcxht/racing/assets/');
            objLoader.load('ground.obj', function (object) {
                object.children.forEach(function (item) {
                    item.receiveShadow = true;
                });
                object.position.y = -5;
                self.scene.add(object);

            }, function () {
                console.log('progress');
            }, function () {
                console.log('error');
            });
        }

        var car = new Car({
            scene: this.scene,
            cb: start,
            light: pointLight,
            camera: this.camera
        });

        var ground;

        function start() {
            ground = new Ground({
                scene: self.scene
            });

            render();
        }

        function render() {
            car.tick();

            requestAnimationFrame(render);
            webGLRenderer.render(self.scene, self.camera);
        }

    }

    event = () => {
        wx.onTouchStart(res => {
            if (!this.gameStatus) return;

            if (res.changedTouches[0].clientX >= window.innerWidth / 2) {
                console.log("右屏");
                car.run = true;
                car.rSpeed = -0.02;
            } else {
                console.log("左屏");
                car.run = true;
                car.rSpeed = 0.02;
            }
        })

        wx.onTouchEnd(res => {
            if (!this.gameStatus) return;

            if (res.changedTouches[0].clientX >= window.innerWidth / 2) {
                console.log("松开右屏");
                car.run = false;
                car.rSpeed = 0;
            } else {
                console.log("松开左屏");
                car.run = false;
                car.rSpeed = 0;
            }
        })
    }

}