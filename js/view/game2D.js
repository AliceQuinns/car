/**
 * 
 *  游戏2D场景
 * 
 */
let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
let ratio = wx.getSystemInfoSync().pixelRatio;

export default class game2D {
    constructor(ctx) {
        this.Superior = ctx;
        this.canvas = wx.createCanvas();
        this.canvas.width = screenWidth * ratio;
        this.canvas.height = screenHeight * ratio;
        this._content = this.canvas.getContext('2d');
        this._content.scale(ratio, ratio);
        this._URL = {
            btnLeft: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/gameLeft.png",
                style: {
                    x: 10,
                    y: screenHeight / 2 - 50,
                    w: 100,
                    h: 130
                },
                range: {
                    startX: 10,
                    startY: screenHeight / 2 - 50,
                    endX: 110,
                    endY: screenHeight / 2 - 50 + 130
                }
            },
            btnRight: {
                url: "https://shop.yunfanshidai.com/xcxht/racing/assets/gameRight.png",
                style: {
                    x: screenWidth - 100 - 10,
                    y: screenHeight / 2 - 50,
                    w: 100,
                    h: 130
                },
                range: {
                    startX: screenWidth - 100 - 10,
                    startY: screenHeight / 2 - 50,
                    endX: screenWidth - 100 - 10 + 100,
                    endY: screenHeight / 2 - 50 + 130
                }
            }
        };
        this._logindIMG();
    }

    // 绘制场景
    render = () => {
        let ctx = this._content;

        ctx.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);

        this._renderIMG('btnLeft');
        this._renderIMG('btnRight');

        this.event();
    }

    event = () => {
        wx.offTouchStart(this.click);
        wx.onTouchStart(this.click);
    }

    click = (e) => {
        let x = e.changedTouches[0].clientX;
        let y = e.changedTouches[0].clientY;

        this.__Range({ x, y }, this._URL.btnLeft.range, () => {
            console.log("左");
        })
        this.__Range({ x, y }, this._URL.btnRight.range, () => {
            console.log("右");
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
        wx.offTouchStart(this.click);
        this._content.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);
    }
}