// pages/index_pre/pre.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      console.log("这是??")
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log("登录成功后从我开始")
    app.globalData.userInfo = e.detail.userInfo
    var openid, appid, unionid
    wx.cloud.callFunction({
      // 云函数名称
      name: 'WeChatLogin',
      // 传给云函数的参数
      success: function (res) {
        console.log(res.result) // 3
        openid = res.result.openid
        appid = res.result.appid
        unionid = res.result.unionid
        console.log(e.detail.userInfo.nickName)
        console.log(openid)
        const db = wx.cloud.database()
        db.collection('userInfo').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              user_wechat_account: app.globalData.userInfo,
              user_registrationtime:new Date(),
              user_lastusetime:new Date(),
              user_jd_cookies: null,
              user_jd_info: null,
              user_jd_inviteId: null
            }
          })
          .then(res => {
            console.log(res)
          })
        var weChatuserInfo = {
          nickName: e.detail.userInfo.nickName,
          openid: openid,
          user_jd_cookies: null,
          user_jd_info: null,
          user_jd_inviteId: null
        }
        wx.setStorage({
          key: "weChatuserInfo",
          data: weChatuserInfo,
          success(res) {
            console.log(res)
            wx.showToast({
              title: '登陆成功!',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
            setTimeout(() => {
              wx.redirectTo({
                url: "../../pages/index/index"
              })
            }, 1000)
          }
        })
        wx.getStorage({
          key: 'weChatuserInfo',
          success(res) {
            console.log(res.data)
          }
        })
      },
      fail: console.error
    })
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})