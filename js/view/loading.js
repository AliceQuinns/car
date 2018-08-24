/**
 * 
 *  loading UI
 * 
 */
let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
let ratio = wx.getSystemInfoSync().pixelRatio;

export default class LodingUI {

    constructor(ctx) {
        let _canvas = wx.createCanvas();
        let _content = _canvas.getContext("2d");
        _canvas.width = screenWidth * ratio;
        _canvas.height = screenHeight * ratio;
        _content.restore();
        _content.scale(ratio, ratio);

        this._canvas = _canvas;
        this._content = _content;

        // let bg = new Image();
        // bg.width = screenWidth;
        // bg.height = screenHeight;
        // bg.src = _bg;
        // console.log(bg);
        // this._content.drawImage(bg,0,0);

        // 背景渐变
        var my_gradient = this._content.createLinearGradient(0, 0, 0, screenHeight);
        my_gradient.addColorStop(0, "#061626");
        my_gradient.addColorStop(0.8, "#020b12");
        my_gradient.addColorStop(1, "#091b32");
        this._content.fillStyle = my_gradient;
        this._content.fillRect(0, 0, screenWidth, screenHeight);

        // logo字体渐变
        var my_text1 = this._content.createLinearGradient(0, 0, 0, screenHeight);
        my_text1.addColorStop(0.2, "#62deed");
        my_text1.addColorStop(0.8, "#091b32");

        var my_text2 = this._content.createLinearGradient(0, 0, 0, screenHeight);
        my_text2.addColorStop(0.2, "#c44805");
        my_text2.addColorStop(0.8, "#fffa7b");

        // logo 
        this._content.fillStyle = my_text1;
        this._content.font="italic small-caps bold 100px arial";
        this._content.textAlign="center"; 
        this._content.fillText('超真实赛车', screenWidth/2, screenHeight/2);

        // title
        this._content.fillStyle = my_text2;
        this._content.font="italic small-caps bold 50px arial";
        this._content.textAlign="center"; 
        this._content.fillText('极速竞赛', screenWidth/2 + 100, screenHeight/1.5);


        let texture = new ctx.THREE.Texture(this._canvas)
        texture.needsUpdate = true

        var spriteMaterial = new ctx.THREE.SpriteMaterial({ map: texture })
        let sprite = new ctx.THREE.Sprite(spriteMaterial)

        sprite.position.set(0, 0, -0.5);
        sprite.scale.set(window.innerWidth / window.innerHeight, 1, 1);

        ctx.scene.add(sprite);
    }

    render(progress) {
        this._content.clear
    }

    delete() {

    }
}