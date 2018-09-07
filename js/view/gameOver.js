/**
 * 
 *  游戏结束UI
 * 
 */
let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
let ratio = wx.getSystemInfoSync().pixelRatio;

export default class gameOverUI {
    constructor(ctx) {
        this.Superior = ctx;
        this.canvas = wx.createCanvas();
        this.canvas.width = screenWidth * ratio;
        this.canvas.height = screenHeight * ratio;
        this._content = this.canvas.getContext('2d');
        this._content.scale(ratio, ratio);
        this._URL = {
            share: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/gameovershare.png",
                style: {
                    x: screenWidth / 1.5,
                    y: screenHeight / 8,
                    w: 150,
                    h: 50
                },
                range: {
                    startX: screenWidth / 1.5,
                    startY: screenHeight / 8,
                    endX: screenWidth / 1.5 + 150,
                    endY: screenHeight / 8 + 50
                }
            },
            start: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/gameoveragain.png",
                style: {
                    x: screenWidth / 1.5,
                    y: screenHeight / 8 + 80,
                    w: 150,
                    h: 50
                },
                range: {
                    startX: screenWidth / 1.5,
                    startY: screenHeight / 8 + 80,
                    endX: screenWidth / 1.5 + 150,
                    endY: screenHeight / 8 + 80 + 50
                }
            },
            friends: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/gameoverRank.png",
                style: {
                    x: screenWidth / 1.5,
                    y: screenHeight / 8 + 160,
                    w: 150,
                    h: 50
                },
                range: {
                    startX: screenWidth / 1.5,
                    startY: screenHeight / 8 + 160,
                    endX: screenWidth / 1.5 + 150,
                    endY: screenHeight / 8 + 160 + 50
                }
            }
        };
        this._logindIMG();
        this.init();
    }

    init() {
        let texture = new THREE.Texture(this.canvas);
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;

        var spriteMaterial = new THREE.SpriteMaterial({
            map: texture
        })
        let sprite = new THREE.Sprite(spriteMaterial)

        sprite.scale.set(window.innerWidth / window.innerHeight, 1, 1);
        sprite.name = "gameoverUI";

        this.UHD = sprite;
        this.UHDMaterial = spriteMaterial;
    }

    // 游戏结束界面
    over = () => {
        if (!this.Superior.scene.getObjectByName("gameoverUI")) {
            this.Superior.scene.add(this.UHD);
        }
        let ctx = this._content;

        ctx.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);

        this._renderIMG('share');
        this._renderIMG('start');
        this._renderIMG('friends');

        this.event("over");

        // 画布更新
        window.setTimeout(() => {
            let camera = this.Superior.camera.position
            this.UHD.position.set(camera.x, camera.y, camera.z - 0.5);
            this.Superior.sharedUI.render({x:camera.x, y:camera.y, z:camera.z - 0.5});
            this.UHDMaterial.map.needsUpdate = true;
        }, 1000);
    }

    event = (type) => {
        wx.offTouchStart(this._overCallback);
        wx.offTouchStart(this._CountdownCallback);
        if (type === "over") {
            wx.onTouchStart(this._overCallback)
        } else if (type === "Countdown") {
            wx.onTouchStart(this._CountdownCallback);
        }
    }

    // over页面事件回调
    _overCallback = (e) => {
        let x = e.changedTouches[0].clientX;
        let y = e.changedTouches[0].clientY;

        // 分享按钮
        this.__Range({ x, y }, this._URL.share.range, () => {
            shareBTN();
        })

        // 重新开始
        this.__Range({ x, y }, this._URL.start.range, () => {
            this.delete();
            this.Superior.sharedUI.delete();

            this.Superior.car.car.position.set(0, -4, -20);
            this.Superior.car.car.rotation.set(0, 0, 0);
            this.Superior.camera.position.set(0, 2, 0);
            this.Superior.camera.rotation.set(0, 0, 0);
            this.Superior.pointLight.position.set(-10, 20, -20);

            this.Superior.indexUI.render();
            this.Superior.audio.onBGM();
        })

        // 好友排行
        this.__Range({ x, y }, this._URL.friends.range, () => {
            wx.postMessage({ type: 2, style: { top: 50, left: 100 } })
        })
    }

    // 倒计时页面事件回调
    _CountdownCallback = (e) => {

    }

    // 矩阵检测
    __Range = (event, target, callback) => {
        if (event.x >= target.startX
            && event.x <= target.endX
            && event.y >= target.startY
            && event.y <= target.endY) {
            callback();
        }
    }

    // 加载ICON
    _logindIMG = () => {
        for (let item in this._URL) {
            let data = this._URL[item];
            let target = new Image();
            target.src = data.url;
            target.onload = () => {
                data.obj = target;
            }
        }
    }

    // 渲染ICON
    _renderIMG = (type) => {
        let target = this._URL[type];
        if (!!target.obj) {
            this._content.drawImage(target.obj, target.style.x, target.style.y, target.style.w, target.style.h);
        }
    }

    delete = () => {
        this._content.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);
        wx.offTouchStart(this._overCallback);
        wx.offTouchStart(this._CountdownCallback);
        this.Superior.scene.remove(this.UHD);
    }
}