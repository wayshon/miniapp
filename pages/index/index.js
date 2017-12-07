//index.js
//获取应用实例
const app = getApp()

const originImages = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];

Page({
  data: {
    userInfo: {},
    imgs: originImages.map(v => `https://wayshon.com/image-files/doudou/${v}`)
  },
  onLoad: function () {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },
  previewImg: function (event) {
    wx.previewImage({
      current: event.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.imgs // 需要预览的图片http链接列表
    })
  }
})
