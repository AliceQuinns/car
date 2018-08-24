/**
 *   游戏首页
 * 
 */

let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
let ratio = wx.getSystemInfoSync().pixelRatio;

export default class indexUI {

    constructor(parent) {
        this.parent = parent;

        this.offCanvas = wx.createCanvas()
        this.ctx = this.offCanvas.getContext("2d");

        this.offCanvas.width = screenWidth * ratio;
        this.offCanvas.height = screenHeight * ratio;

        this.ctx.restore();
        this.ctx.scale(ratio, ratio);

        GameGlobal.index = this.offCanvas;
    }

    render() {
        let ctx = this.ctx;
        ctx.fillStyle = "rgba(1,1,1, 0.3)"
        ctx.fillRect(0, 0, GameGlobal.innerWidth, GameGlobal.innerHeight)

        ctx.fillStyle = "#fff"
        ctx.font = "bold 40px Arial"
        ctx.textAlign = "center"
        ctx.fillText("真实赛车", GameGlobal.innerWidth / 2, 50)

        ctx.fillStyle = "#fff"
        ctx.font = "bold 20px Arial"
        ctx.textAlign = "center"
        ctx.fillText("开始游戏", GameGlobal.innerWidth / 2, 300)

        // let bg = new Image();
        // bg.src = "https://shop.yunfanshidai.com/xcxht/racing/assets/logind.jpg";
        // bg.onload = function () {
        //     ctx.drawImage(bg, 0, 0);
        // }

        let texture = new this.parent.THREE.Texture(this.offCanvas)
        texture.needsUpdate = true

        var spriteMaterial = new this.parent.THREE.SpriteMaterial({ map: texture })
        let sprite = new this.parent.THREE.Sprite(spriteMaterial)

        sprite.position.set(0, 0, -0.5);
        sprite.scale.set(window.innerWidth / window.innerHeight, 1, 1);

        this.parent.scene.add(sprite);

        GameGlobal.indexUI = sprite;
        GameGlobal.scene = this.parent.scene;
    }

    delete() {

    }

    updata() {

    }
}