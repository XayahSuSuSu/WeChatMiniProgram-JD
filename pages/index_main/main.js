// pages/main.js
var weChatuserInfo
var inviteId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isCopyDisabled: true,
      isGetDisabled: false
    })

  },
  get_jd_game_info: function () {
    var that = this;
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
      },
      fail: console.error
    })

    const db = wx.cloud.database()
    db.collection('userInfo').where({
        _openid: openid,
      })
      .get({
        success: function (res) {

          wx.getStorage({
            key: 'weChatuserInfo',
            complete(res) {
              weChatuserInfo = res
              console.log(weChatuserInfo.data)
              if (weChatuserInfo.data.user_jd_inviteId == null) {
                // 本地inviteId为空,调用云函数获取
                wx.cloud.callFunction({
                  // 云函数名称
                  name: 'GetInviteId',
                  // 传给云函数的参数
                  data: {
                    cookies: weChatuserInfo.data.user_jd_cookies
                  },
                  success: function (response) {
                    console.log(response) // 3
                    var weChatuserInfo_Updated = {
                      nickName: weChatuserInfo.data.user_jd_info,
                      openid: weChatuserInfo.data.user_jd_info,
                      user_jd_cookies: weChatuserInfo.data.user_jd_cookies,
                      user_jd_info: weChatuserInfo.data.user_jd_info,
                      user_jd_inviteId: response.result.inviteId
                    }
                    wx.setStorage({
                      key: "weChatuserInfo",
                      data: weChatuserInfo_Updated,
                      success(res) {
                        console.log(res)
                        that.setData({
                          inviteId: response.result.inviteId,
                          isCopyDisabled: false,
                          isGetDisabled: true
                        })
                      }
                    })

                  },
                  fail: console.error
                })
              } else {
                console.log("inviteId不为空,调用本地获取...")
                console.log("本地的inviteId:" + weChatuserInfo.data.user_jd_inviteId)
                // 本地已有inviteId,直接调用
                that.setData({
                  inviteId: weChatuserInfo.data.user_jd_inviteId,
                  isCopyDisabled: false,
                  isGetDisabled: true
                })

              }
            }
          })


        }
      })
  },
  setClipboard: function () {
    wx.showToast({
      title: '复制成功',
    })
    wx.setClipboardData({
      data: inviteId,
      success: function (res) {
        wx.getClipboardData({ //这个api是把拿到的数据放到电脑系统中的
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }

    })
  },
  helpIt: function () {
    var that = this
    wx.getStorage({
      key: 'weChatuserInfo',
      complete(res) {
        weChatuserInfo = res
        console.log(weChatuserInfo.data.user_jd_inviteId)
        wx.cloud.callFunction({
          // 云函数名称
          name: 'HelpOthers',
          // name: 'HelpOthersActually',
          // 传给云函数的参数
          data: {
            cookies: weChatuserInfo.data.user_jd_cookies,
            inviteId:that.data.content
          },
          success: function (response) {
            
            var mJsonStr = response.result.response
            var mJson = JSON.parse(mJsonStr)
            console.log(mJson.body.data.result.homeMainInfo) // 3
            var msgForStatus = mJson.body.data.result.homeMainInfo.guestInfo.msgForStatus
            var itemId = mJson.body.data.result.homeMainInfo.guestInfo.itemId
            console.log(msgForStatus)
            var secretp= mJson.body.data.result.homeMainInfo.secretp
            var inviteId = mJson.body.data.result.homeMainInfo.inviteId
            wx.cloud.callFunction({
              // 云函数名称
              name: 'HelpOthersActually',
              // 传给云函数的参数
              data: {
                cookies: weChatuserInfo.data.user_jd_cookies,
                itemId:itemId,
                secretp:secretp,
                inviteId:inviteId
              },
              success: function (response) {
                console.log(response)
              },
              fail: console.error
            })

          },
          fail: console.error
        })
      }
    })



  },

  inPutFun:function(e){

    this.setData({
      content:e.detail.value
    })
    console.info(this.data.content);
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