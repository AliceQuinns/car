export default class aduio {
    constructor(ctx) {
        this._url = {
            bgm: "https://shop.yunfanshidai.com/xcxht/racing/assets/bgm.mp3",
            cheer: "https://shop.yunfanshidai.com/xcxht/racing/assets/Cheer.mp3",// 喝彩
            money: "https://shop.yunfanshidai.com/xcxht/racing/assets/money.mp3",// 金币道具
            skidding: "https://shop.yunfanshidai.com/xcxht/racing/assets/Skidding.mp3",// 漂移
            Tohit: "https://shop.yunfanshidai.com/xcxht/racing/assets/Tohit.mp3",// 爆炸
            travel: "https://shop.yunfanshidai.com/xcxht/racing/assets/travel.mp3",// 加速
            accelerate: "https://shop.yunfanshidai.com/xcxht/racing/assets/accelerate.mp3"// 加速2
        }
        this.audiopool = {};// 音频池
        this.status = true;// 全局音频控制
    }
    // 创建音频
    _createAudio = (src) => {
        let target = wx.createInnerAudioContext();
        target.src = src;
        return target;
    }

    // 背景音乐
    onBGM = (prop) => {
        let target = this.audiopool["bgm"];
        if (!this.status) return;
        if (prop === "close") {
            if (!!target) {
                target.stop();
                target.destroy();
            }
            return;
        };
        if (!target) {
            target = this._createAudio(this._url.bgm);
            this.audiopool["bgm"] = target;
            target.loop = true;
        }
        target.play();
    }

    // 漂移
    onSkidding = () => {
        this._Sound('skidding');
    }

    // 加速
    onTravel = (prop) => {
        let target = this.audiopool["travel"];
        if (!this.status) return;
        if (prop === "close") {
            if (!!target) {
                target.stop();
                target.destroy();
                this.audiopool["travel"] = null;
            }
            return;
        };
        if (!target) {
            target = this._createAudio(this._url.travel);
            this.audiopool["travel"] = target;
            target.loop = true;
        }
        target.play();
    }

    // 金币道具
    onMoney = () => {
        this._Sound("money");
    }

    // 爆炸
    onTohit = () => {
        this._Sound("Tohit");
    }

    // 喝彩
    oncheer = () => {
        this._Sound("cheer");
    }

    // 音效
    _Sound = (type) => {
        if (!this.status) return;
        let target = this.audiopool[type];
        if (!target) {
            console.log('create is ', type);
            target = this._createAudio(this._url[type]);
            this.audiopool[type] = target
        }
        if (!target.paused) {
            target.seek(0);
            target.play();
        }
        target.play();
    }

    // 音效控制
    control = (type) => {
        let self = this;
        if (type === "close") {
            this.status = false;
            if (!!self.audiopool["bgm"]) {
                console.log("停止背景音乐");
                self.audiopool["bgm"].stop();
                if(!!self.audiopool["travel"])self.audiopool["travel"].stop();
            }
        } else if (type === "open") {
            this.status = true;
        }
    }
}