/**
 * 
 *   游戏首页
 * 
 */

let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
let ratio = wx.getSystemInfoSync().pixelRatio;

export default class indexUI {

    constructor(parent) {

        this.parent = parent;

        this.canvas = wx.createCanvas();
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = screenWidth * ratio;
        this.canvas.height = screenHeight * ratio;

        this.ctx.restore();
        this.ctx.scale(ratio, ratio);

        this._URL = {
            title: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/logo.png",
                style: {
                    x: screenWidth / 2 - 200,
                    y: 20,
                    w: 400,
                    h: 150
                }
            },
            play: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/play.png",
                style: {
                    x: screenWidth / 2 - 75,
                    y: screenHeight / 1.5,
                    w: 150,
                    h: 55
                },
                range: {
                    startX: screenWidth / 2 - 75,
                    startY: screenHeight / 1.5,
                    endX: screenWidth / 2 - 75 + 150,
                    endY: screenHeight / 1.5 + 55
                }
            },
            rank: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/rank.png",
                style: {
                    x: 20,
                    y: screenHeight / 1.2,
                    w: 50,
                    h: 50
                },
                range: {
                    startX: 20,
                    startY: screenHeight / 1.2,
                    endX: 20 + 50,
                    endY: 50 + screenHeight / 1.2
                }
            },
            share: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/share.png",
                style: {
                    x: 80,
                    y: screenHeight / 1.2,
                    w: 50,
                    h: 50
                },
                range: {
                    startX: 80,
                    startY: screenHeight / 1.2,
                    endX: 80 + 50,
                    endY: 50 + screenHeight / 1.2
                }
            },
            vioce_close: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/vioce_close.png",
                style: {
                    x: screenWidth - 130,
                    y: screenHeight / 1.2,
                    w: 50,
                    h: 50
                },
                range: {
                    startX: screenWidth - 130,
                    startY: screenHeight / 1.2,
                    endX: screenWidth - 130 + 50,
                    endY: 50 + screenHeight / 1.2
                }
            },
            vioce_open: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/vioce_open.png",
                style: {
                    x: screenWidth - 130,
                    y: screenHeight / 1.2,
                    w: 50,
                    h: 50
                },
                range: {
                    startX: screenWidth - 130,
                    startY: screenHeight / 1.2,
                    endX: screenWidth - 130 + 50,
                    endY: 50 + screenHeight / 1.2
                }
            },
            invita: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/invita.png",
                style: {
                    x: screenWidth - 190,
                    y: screenHeight / 1.2,
                    w: 50,
                    h: 50
                },
                range: {
                    startX: screenWidth - 190,
                    startY: screenHeight / 1.2,
                    endX: screenWidth - 190 + 50,
                    endY: 50 + screenHeight / 1.2
                }
            },
            coin: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/coin.png",
                style: {
                    x: 30,
                    y: 13,
                    w: 25,
                    h: 25
                }
            },
            coin_bg: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/coin_bg.png",
                style: {
                    x: 20,
                    y: 10,
                    w: 100,
                    h: 30
                }
            },
            appearance: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/appearance.png",
                style: {
                    x: screenWidth - 70,
                    y: screenHeight / 1.2,
                    w: 50,
                    h: 50
                },
                range: {
                    startX: screenWidth - 70,
                    startY: screenHeight / 1.2,
                    endX: screenWidth - 70 + 50,
                    endY: 50 + screenHeight / 1.2
                }
            },
            close_btn: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/close.png",
                style: {
                    x: screenWidth / 2 - 25,
                    y: screenHeight / 1.3,
                    w: 50,
                    h: 50
                },
                range: {
                    startX: screenWidth / 2 - 25,
                    startY: screenHeight / 1.3,
                    endX: screenWidth / 2 - 25 + 50,
                    endY: 50 + screenHeight / 1.3
                }
            }
        };
        this._logindIMG();// 预加载图片资源
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
            this.ctx.drawImage(target.obj, target.style.x, target.style.y, target.style.w, target.style.h);
        }
    }

    // 绘制场景
    render = () => {
        let ctx = this.ctx;

        ctx.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);

        this._renderIMG('title');

        this._renderIMG('play')

        this._renderIMG('rank');

        this._renderIMG('share');

        this._renderIMG('appearance');

        this._renderIMG('vioce_open');

        this._renderIMG('invita');

        this._renderIMG('coin_bg');

        this._renderIMG('coin');

        ctx.fillStyle = "#ffffff";
        ctx.font = "italic small-caps bold 20px arial";
        ctx.fillText('200', 60, 32);

        // 绑定事件
        this.event();
    }

    event = () => {
        let self = this;
        if (!!this._eventCallback) {
            wx.offTouchStart(this._eventCallback);
        }

        this._eventCallback = (e) => {
            let x = e.changedTouches[0].clientX;
            let y = e.changedTouches[0].clientY;

            // 开始游戏
            this.__Range({ x, y }, this._URL.play.range, () => {
                this.parent.gamestart();
            })

            // 排行榜
            this.__Range({ x, y }, this._URL.rank.range, () => {
                wx.postMessage({ type: 2, style: { top: 50 ,left: 320} });
                this.parent.canvasPool = [this.parent.gameCanvas, this.parent.indexUI.canvas, sharedCanvas];

                // 禁用其他按钮事件
                wx.offTouchStart(this._eventCallback);

                // 显示close按钮
                this._renderIMG('close_btn');

                // 监听close按钮事件
                wx.onTouchStart(self.close_callback);
            })

            // 分享
            this.__Range({ x, y }, this._URL.share.range, () => {
                shareBTN();
            })

            // invita
            this.__Range({ x, y }, this._URL.invita.range, () => {
                console.log('invita');
            })

            // appearance
            this.__Range({ x, y }, this._URL.appearance.range, () => {
                console.log('appearance');
            })

            // audio
            this.__Range({ x, y }, this._URL.vioce_open.range, () => {
                console.log('audio');
                let status = !self.parent.audio.status;
                if(status){
                    self.parent.audio.control("open");
                    self.parent.audio.onBGM();
                    self.render();
                }else{
                    self.parent.audio.control("close");
                    this._renderIMG('vioce_close');
                }
            })

        }
        wx.onTouchStart(this._eventCallback)
    }

    // 排行榜关闭按钮
    close_callback = (e) => {
        let x = e.changedTouches[0].clientX;
        let y = e.changedTouches[0].clientY;
        this.__Range({ x, y }, this._URL.close_btn.range, () => {
            this.parent.canvasPool = [this.parent.gameCanvas, this.parent.indexUI.canvas];
            wx.offTouchStart(this.close_callback);
            this.render();
        })
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

    delete() {
        this.ctx.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio)
        if (!!this._eventCallback) wx.offTouchStart(this._eventCallback);
    }

}