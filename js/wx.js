
let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
let openDataContext = wx.getOpenDataContext();
let sharedCanvas = openDataContext.canvas;
let ratio = wx.getSystemInfoSync().pixelRatio;
sharedCanvas.width = screenWidth * ratio;
sharedCanvas.height = screenHeight * ratio;

GameGlobal.WxModular = {
    // 主动分享 被动分享 群分享功能
    share: () => {
        wx.request({
            url: 'https://shop.yunfanshidai.com/xcxht/slyxhz/api/share_info.php?gameid=24',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                // 开启转发功能
                wx.showShareMenu({ withShareTicket: true });

                // 主动转发
                window.shareBTN = () => {
                    wx.shareAppMessage({
                        title: res.data.info,
                        imageUrl: res.data.image
                    })
                };

                // 被动转发
                wx.onShareAppMessage(function () {
                    return {
                        title: res.data.info,
                        imageUrl: res.data.image
                    }
                });

                // 群分享
                wx.onShow((data) => {
                    if (data.shareTicket) {
                        console.log("此小游戏是通过群分享进入的", data.shareTicket);
                        // window.GROUPSHARE = true;
                    }
                });
            }
        })
    },
    // 更多游戏
    MoreGames: () => {
        wx.request({
            url: "https://shop.yunfanshidai.com/xcxht/slyxhz/api/share_info.php?gameid=24",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: (res) => {
                if (!!res.data.pic) {
                    wx.previewImage({
                        urls: [
                            res.data.pic
                        ]
                    })
                } else {
                    console.log("分享图请求失败", res);
                }
            }
        });
    },
    // 游戏圈
    gameClub: () => {

    },
    // 截屏
    Screenshot: (type) => {
        // 5:4  canvas.height/2-(canvas.width/5*4)/2
        if (type === 1) {
            return canvas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: canvas.width,
                height: canvas.width / 5 * 4,
                destWidth: canvas.width,
                destHeight: canvas.width / 5 * 4,
            });
        } else if (type === 2) {
            // 全屏
            return canvas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: canvas.width,
                height: canvas.height,
                destWidth: canvas.width,
                destHeight: canvas.height,
            });
        }
    }
};
GameGlobal.WxModular.share();