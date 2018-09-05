import outside from './base/outside.js'
import * as THREE from './libs/three.js'
let camera;
let pad;

export default function Car(params) {
    pad = params.ctx;
    var self = this;
    var car;
    var mtlLoader = new THREE.MTLLoader();
    camera = params.camera;

    // 汽车速度变量 
    this.speed = 0;// 实时速度
    this.rSpeed = 0;// 左右控制
    this.run = false;// 前进控制
    this.acceleration = 0.1;// 加速度
    this.deceleration = 0.04;// 减速度
    this.maxSpeed = 1.5;// 最大速度

    this.light = params.light;// 点光源

    this.lock = -1;
    this.isBrake = false;

    this.realRotation = 0; // 真实的旋转
    this.dirRotation = 0; // 方向上的旋转
    this.addRotation = 0; // 累计的旋转角度

    this.leftFront = {};

    this.leftBack = {};

    // 渲染汽车模型
    mtlLoader.setPath('https://shop.yunfanshidai.com/xcxht/racing/assets/car/car2/');
    mtlLoader.load('car2.mtl', function (materials) {
        params.ctx.logindUI.update("加载汽车模型中...");
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        // console.log(materials)
        objLoader.setMaterials(materials);
        objLoader.setPath('https://shop.yunfanshidai.com/xcxht/racing/assets/car/car2/');
        objLoader.load('car2.obj', function (object) {
            params.ctx.logindUI.update("加载汽车材质中...");
            car = object;
            car.children.forEach(function (item) {
                item.castShadow = true;// 渲染阴影映射
            });
            car.position.z = -20;
            car.position.y = -5;

            params.scene.add(car);
            self.car = car;

            params.cb();// 加载赛道

        }, function (xhr) {
            console.log('progress');
        }, function () {
            console.log('error');
        });
    });
}

Car.prototype.tick = function () {

    // 汽车闪烁
    if (this.lock > 0) {
        this.lock--;
        if (this.lock % 2) {
            this.car.visible = false;
        } else {
            this.car.visible = true;
        }
        return;
    }

    // 前进或后退
    if (this.run) {
        this.speed += this.acceleration;
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
    } else {
        this.speed -= this.deceleration;
        if (this.speed < 0) {
            this.speed = 0;
        }
    }

    // 速度为零停止运动
    var speed = -this.speed;
    if (speed === 0) {
        return;
    }

    // 漂移算法
    var time = Date.now();

    this.dirRotation += this.rSpeed;
    this.realRotation += this.rSpeed;

    var rotation = this.dirRotation;

    // 偏航角
    if (this.isBrake) {
        this.realRotation += this.rSpeed * (this.speed / 2);
    } else {
        if (this.realRotation !== this.dirRotation) {
            this.dirRotation += (this.realRotation - this.dirRotation) / 20000 * (this.speed) * (time - this.cancelBrakeTime);
        }
    }

    // 移动汽车
    var speedX = Math.sin(rotation) * speed;
    var speedZ = Math.cos(rotation) * speed;

    var tempX = this.car.position.x + speedX;
    var tempZ = this.car.position.z + speedZ;

    // 光线移动
    this.light.position.set(-10 + tempX, 20, tempZ);
    this.light.shadow.camera.updateProjectionMatrix();


    // 碰撞检测
    var tempA = -(this.car.rotation.y + 0.523);
    this.leftFront.x = Math.sin(tempA) * 8 + tempX;
    this.leftFront.y = Math.cos(tempA) * 8 + tempZ;

    tempA = -(this.car.rotation.y + 2.616);
    this.leftBack.x = Math.sin(tempA) * 8 + tempX;
    this.leftBack.y = Math.cos(tempA) * 8 + tempZ;

    var collisionSide = this.physical();
    var correctedSpeed;
    if (collisionSide > -1) {
        console.log("发生碰撞");
        pad.audio.onTohit();
        pad.audio.onTravel("close");
        pad.gameover();// 得分界面

        // 根据向量投影计算碰撞之后的速度和方向
        // correctedSpeed = this.collision(speedX, speedZ, collisionSide);

        // speedX = correctedSpeed.vx * 5;
        // speedZ = correctedSpeed.vy * 5;

        // var angle = Math.atan2(-speedZ, speedX);

        // this.realRotation = -1 * (Math.PI / 2 - angle);
        // rotation = this.dirRotation = this.realRotation;

        this.speed = 0;
        this.reset();

        this.realRotation = 0; // 真实的旋转
        this.dirRotation = 0; // 方向上的旋转
        rotation = 0;
    }


    // 汽车航向旋转
    this.car.rotation.y = this.realRotation;

    // 移动汽车
    this.car.position.z += speedZ;
    this.car.position.x += speedX;

    // 摄像机跟随
    camera.rotation.y = rotation;
    camera.position.x = this.car.position.x + Math.sin(rotation) * 20;
    camera.position.z = this.car.position.z + Math.cos(rotation) * 20;
};

Car.prototype.brake = function () {
    this.v = 10;

    this.isBrake = true;
};

Car.prototype.cancelBrake = function () {
    this.cancelBrakeTime = Date.now();
    this.isBrake = false;
};

// 边界检测
Car.prototype.physical = function () {
    var i = 0;

    for (; i < outside.length; i += 4) {
        if (isLineSegmentIntr(this.leftFront, this.leftBack, {
            x: outside[i],
            y: outside[i + 1]
        }, {
                x: outside[i + 2],
                y: outside[i + 3]
            })) {
            return i;
        }
    }

    return -1;
};

Car.prototype.reset = function () {
    this.lock = 60;
};

Car.prototype.collision = function (sx, sz, side) {
    var pos = this.car.position;
    var result = getBounceVector({
        p0: {
            x: pos.x,
            y: pos.z
        },
        p1: {
            x: pos.x + sx,
            y: pos.z + sz
        },
        vx: sx,
        vy: sz
    }, {
            p0: {
                x: outside[side],
                y: outside[side + 1]
            },
            p1: {
                x: outside[side + 2],
                y: outside[side + 3]
            },
            vx: outside[side + 2] - outside[side],
            vy: outside[side + 3] - outside[side + 1]
        });

    return result;
};

function isLeft(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) < 0;
}

function getBounceVector(obj, w) {
    var len = Math.sqrt(w.vx * w.vx + w.vy * w.vy);
    w.dx = w.vx / len;
    w.dy = w.vy / len;

    w.rx = -w.dy;
    w.ry = w.dx;

    w.lx = w.dy;
    w.ly = -w.dx;

    var projw = getProjectVector(obj, w.dx, w.dy);
    var projn;
    var left = isLeft(w.p0, w.p1, obj.p0);

    if (left) {
        projn = getProjectVector(obj, w.rx, w.ry);
    } else {
        projn = getProjectVector(obj, w.lx, w.ly);
    }
    projn.vx *= -0.5;
    projn.vy *= -0.5;

    return {
        vx: projw.vx + projn.vx,
        vy: projw.vy + projn.vy,
    };
}


function getProjectVector(u, dx, dy) {
    var dp = u.vx * dx + u.vy * dy;

    return {
        vx: (dp * dx),
        vy: (dp * dy)
    };
}

// 三角形面积法 
function isLineSegmentIntr(a, b, c, d) {
    // console.log(a, b);
    var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);

    var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);

    if (area_abc * area_abd > 0) {
        return false;
    }

    var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);

    var area_cdb = area_cda + area_abc - area_abd;
    if (area_cda * area_cdb > 0) {
        return false;
    }

    return true;
}
