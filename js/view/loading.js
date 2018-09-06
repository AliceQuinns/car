/**
 * 
 *  加载界面
 * 
 */
let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
let ratio = wx.getSystemInfoSync().pixelRatio;

export default class LodingUI {

    constructor(params) {
        this.params = params;
        this.canvas = wx.createCanvas();
        this.canvas.width = screenWidth * ratio;
        this.canvas.height = screenHeight * ratio;
        this._content = this.canvas.getContext('2d');
        this._content.scale(ratio, ratio);

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
        sprite.position.set(0, 0, -0.5);

        sprite.scale.set(window.innerWidth / window.innerHeight, 1, 1);
        sprite.name = "loadingUI";

        this.UHD = sprite;
        this.UHDMaterial = spriteMaterial;
    }

    update(title) {
        if(!this.params.scene.getObjectByName("loadingUI")){
            this.params.scene.add(this.UHD);
        }

        this._content.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);

        // 背景渐变
        var my_gradient = this._content.createLinearGradient(0, 0, 0, screenHeight);
        my_gradient.addColorStop(0, "#061626");
        my_gradient.addColorStop(0.5, "#020b12");
        my_gradient.addColorStop(1, "#091b32");
        this._content.fillStyle = my_gradient;
        this._content.fillRect(0, 0, screenWidth, screenHeight);

        // logo字体渐变
        var my_text1 = this._content.createLinearGradient(0, 0, 0, screenHeight);
        my_text1.addColorStop(0.2, "#62deed");
        my_text1.addColorStop(0.8, "#091b32");

        // title
        var my_text2 = this._content.createLinearGradient(0, 0, 0, screenHeight);
        my_text2.addColorStop(0.2, "#c44805");
        my_text2.addColorStop(0.8, "#fffa7b");

        // logo 
        this._content.fillStyle = "#62deed";
        this._content.font = "italic small-caps bold 100px arial";
        this._content.textAlign = "center";
        this._content.fillText('超真实赛车', screenWidth / 2, screenHeight / 2);

        // title
        this._content.fillStyle = "#fffa7b";
        this._content.font = "italic small-caps bold 50px arial";
        this._content.textAlign = "center";
        this._content.fillText('极速竞赛', screenWidth / 2 + 100, screenHeight / 1.5);

        // 提示文本
        this._content.fillStyle = "#ffffff";
        this._content.font = "italic small-caps bold 18px arial";
        this._content.textAlign = "center";
        this._content.fillText((!!title) ? title : this._title, screenWidth / 2, screenHeight / 1.1);

        // 画布更新
        this.UHDMaterial.map.needsUpdate = true;
    }

    delete() {
        this._content.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);
        this.params.scene.remove(this.UHD);
    }
}