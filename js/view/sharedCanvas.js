export default class shared {
    constructor(params) {
        this.params = params;
        this.time = null;// 计时器
        this.loop = false;// 渲染控制

        let screenHeight = window.innerHeight;
        let screenWidth = window.innerWidth;
        let openDataContext = wx.getOpenDataContext();
        let sharedCanvas = openDataContext.canvas;
        let ratio = wx.getSystemInfoSync().pixelRatio;
        sharedCanvas.width = screenWidth * ratio;
        sharedCanvas.height = screenHeight * ratio;

        this.init();
    }

    init() {
        let texture = new THREE.Texture(sharedCanvas);
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;

        var spriteMaterial = new THREE.SpriteMaterial({
            map: texture
        })
        let sprite = new THREE.Sprite(spriteMaterial)
        sprite.position.set(0, 0, -0.495);

        sprite.scale.set(window.innerWidth / window.innerHeight, 1, 1);
        sprite.name = "sharedCanvasUI";

        this.UHD = sprite;
        this.UHDMaterial = spriteMaterial;
    }

    render(pos) {
        this.loop = true;
        if (!this.params.scene.getObjectByName("sharedCanvasUI")) {
            this.params.scene.add(this.UHD);
        }

        if(!!pos)this.UHD.position.set(pos.x, pos.y, pos.z);
        let callback = () => {
            if(!this.loop){window.clearInterval(this.time);return;}
            this.UHDMaterial.map.needsUpdate = true;
            console.log(1);
        }
        this.time =  window.setInterval(callback,1000);
    }

    delete() {
        this.loop = false;
        this.params.scene.remove(this.UHD);
    }
}