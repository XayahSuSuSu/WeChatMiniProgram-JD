//index.js
//获取应用实例
const app = getApp()
var weChatuserInfo
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.getStorage({
      key: 'weChatuserInfo',
      complete(res) {
        weChatuserInfo = res.data
        console.log(weChatuserInfo)
        if (weChatuserInfo != undefined) {
          console.log("微信已经登陆过了!")
          wx.showToast({
            title: '登录成功!',
            icon: 'succes',
            duration: 500,
            mask: true
          })
          if (weChatuserInfo.user_jd_cookies == null) {
            console.log("没有JDCookies!前往获取...")
            wx.showToast({
              title: '未获取到Cookies,请点击登录按钮!',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          } else {
            wx.redirectTo({
              url: "../../pages/index_main/main"
            })
          }
        } else {
          console.log("微信还没有登录!")
          wx.redirectTo({
            url: "../../pages/index_pre/pre"
          })

        }
      }
    })
    this.setData({
      stateText: "请点击登录按钮后\n打开京东APP扫描下方二维码:"
    })
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res.userInfo)
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
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getQRCode2: function () {
    var that = this;
    wx.request({
      url: 'https://qr.m.jd.com/show?appid=133&size=147&t=' + (new Date()).getTime(), // 仅为示例，并非真实的接口地址
      method: 'GET',
      responseType: 'arraybuffer',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        app.globalData.base64 = wx.arrayBufferToBase64(res.data);
        that.setData({
          QRCodePath: "data:image/png;base64," + app.globalData.base64
        });
        console.log(res.header);
        console.log(res.header['Set-cookie']);
        var mCookie = res.header['Set-cookie'];
        var mQRCodeKey = mCookie.substring(mCookie.indexOf("=") + 1, mCookie.indexOf(";"));
        console.log(mQRCodeKey);
        var mWlfstk_smdl = mCookie.substring(mCookie.indexOf("=", mCookie.indexOf("=") + 1) + 1, mCookie.indexOf(";", mCookie.indexOf(";") + 1));
        console.log(mWlfstk_smdl);
        var mJQuery = Math.random();
        mJQuery = mJQuery * 100000;
        mJQuery = Math.floor(mJQuery);
        console.log(mJQuery);
        var mInterval = setInterval(function () {
          wx.request({
            url: 'https://service-fhjv6yh0-1303879152.gz.apigw.tencentcs.com/release/AcmeZoneNeed',
            data: {
              QRCodeKey: mQRCodeKey,
              wlfstk_smdl: mWlfstk_smdl,
              jQuery: mJQuery
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              var mReturnJson = res.data.substring(res.data.indexOf("(") + 1, res.data.indexOf(")"));
              console.log(mReturnJson)
              var mCode = JSON.parse(mReturnJson).code;
              var mTicket = JSON.parse(mReturnJson).ticket;
              console.log(mCode);
              console.log(mTicket);
              if (mCode == 200) {
                clearInterval(mInterval);
                that.setData({
                  stateText: "登录成功!正在跳转...",
                });
                wx.request({
                  mQrCodeTicketValidationUrl: 'https://passport.jd.com/uc/qrCodeTicketValidation?t=' + mTicket,
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success(res) {
                    console.log(res.data)
                  }
                })

              } else if (mCode == 201) {
                that.setData({
                  stateText: "二维码未扫描，请扫描二维码"
                });
              } else if (mCode == 203) {
                that.setData({
                  stateText: "二维码过期，请重新扫描"
                });
              }

            }
          })

        }, 3000);
      }
    })
  },
  getQRCode: function () {
    var that = this;
    var token, okl_token, cookies
    console.log(weChatuserInfo.user_jd_cookies)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'GetQRParameter',
      // 传给云函数的参数
      success: function (response) {
        console.log(response) // 3
        token = response.result.token
        okl_token = response.result.okl_token
        cookies = response.result.cookies
        console.log("token:" + token);
        console.log("okl_token:" + okl_token);
        console.log("cookies:" + cookies);
        var timeStamp = (new Date()).getTime()
        wx.request({
          url: 'https://api88.net/api/code/?type=img&text=https://plogin.m.jd.com/cgi-bin/m/tmauth%3Fclient_type%3Dm%26appid%3D300%26token%3D' + token,
          method: 'GET',
          responseType: 'arraybuffer',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            app.globalData.base64 = wx.arrayBufferToBase64(res.data);
            that.setData({
              QRCodePath: "data:image/png;base64," + app.globalData.base64
            });
            console.log("开始")
            var mInterval = setInterval(function () {
              console.log("开始")
              wx.cloud.callFunction({
                // 云函数名称
                name: 'CheckLogin',
                // 传给云函数的参数
                data: {
                  token: token,
                  okl_token: okl_token,
                  cookies: cookies
                },
                success: function (res) {
                  console.log(res.result.response.body)
                  var mCode = res.result.response.body.errcode
                  if (mCode == 0) {
                    clearInterval(mInterval);
                    var TrackerID = res.result.response.headers['set-cookie'][0]
                    TrackerID = TrackerID.substring(TrackerID.indexOf("=") + 1, TrackerID.indexOf(";"))
                    var pt_key = res.result.response.headers['set-cookie'][1]
                    pt_key = pt_key.substring(pt_key.indexOf("=") + 1, pt_key.indexOf(";"))
                    var pt_pin = res.result.response.headers['set-cookie'][2]
                    pt_pin = pt_pin.substring(pt_pin.indexOf("=") + 1, pt_pin.indexOf(";"))
                    var pt_token = res.result.response.headers['set-cookie'][3]
                    pt_token = pt_token.substring(pt_token.indexOf("=") + 1, pt_token.indexOf(";"))
                    var pwdt_id = res.result.response.headers['set-cookie'][4]
                    pwdt_id = pwdt_id.substring(pwdt_id.indexOf("=") + 1, pwdt_id.indexOf(";"))
                    var s_key = res.result.response.headers['set-cookie'][5]
                    s_key = s_key.substring(s_key.indexOf("=") + 1, s_key.indexOf(";"))
                    var s_pin = res.result.response.headers['set-cookie'][6]
                    s_pin = s_pin.substring(s_pin.indexOf("=") + 1, s_pin.indexOf(";"))
                    console.log("TrackerID:" + TrackerID);
                    console.log("pt_key:" + pt_key);
                    console.log("pt_pin:" + pt_pin);
                    console.log("pt_token:" + pt_token);
                    console.log("pwdt_id:" + pwdt_id);
                    console.log("s_key:" + s_key);
                    console.log("s_pin:" + s_pin);
                    cookies = "TrackerID=" + TrackerID + "; pt_key=" + pt_key + "; pt_pin=" + pt_pin + "; pt_token=" + pt_token + "; pwdt_id=" + pwdt_id + "; s_key=" + s_key + "; s_pin=" + s_pin + "; wq_skey="
                    console.log("cookies:" + cookies)
                    wx.cloud.callFunction({
                      // 云函数名称
                      name: 'GetUserInfo',
                      // 传给云函数的参数
                      data: {
                        cookies: cookies,
                      },
                      success: function (res) {
                        console.log(res.result.response.body.base)
                        

                        var weChatuserInfo_Updated = {
                          nickName: weChatuserInfo.nickName,
                          openid: weChatuserInfo.openid,
                          user_jd_cookies: cookies,
                          user_jd_info: res.result.response.body.base,
                          user_jd_inviteId: null
                        }
                        wx.setStorage({
                          key: "weChatuserInfo",
                          data: weChatuserInfo_Updated,
                          success(res) {
                            console.log(res)
                            that.setData({
                              stateText: "登录成功!正在跳转...",
                            });
    
                            wx.showToast({
                              title: '登陆成功!',
                              icon: 'succes',
                              duration: 1000,
                              mask: true
                            })
                            setTimeout(() => {
                              wx.redirectTo({
                                url: "../../pages/index_main/main"
                              })
                            }, 1000)
                          }
                        })
                        
                        wx.cloud.callFunction({
                          // 云函数名称
                          name: 'UpdateDatas',
                          // 传给云函数的参数
                          data: {
                            openid:weChatuserInfo.openid,
                            user_jd_info: res.result.response.body.base,
                          },
                          success: function (res) {
                           console.log(res)
                          },
                          fail: console.error
                         })
                      },
                      fail: console.error
                    })

                  } else if (mCode == 176) {
                    that.setData({
                      stateText: "二维码未扫描，请扫描二维码"
                    });
                  } else if (mCode == 21) {
                    that.setData({
                      stateText: "二维码过期，请重新扫描"
                    });
                  }else if (mCode == 261) {
                    that.setData({
                      stateText: "二维码过期，请重新扫描"
                    });
                  }
                },
                fail: console.error
              })
            }, 3000);
          }
        })
      },
      fail: console.error
    })










    if (weChatuserInfo.user_jd_cookies == null) {
      // 本地没有用户的Cookies信息,尝试从云端获取
      const db = wx.cloud.database()
      db.collection('userInfo').where({
        _openid: weChatuserInfo._openid,
      }).get().then(res => {
        console.log(res.data) // 获取云端用户信息
        if (res.data[0].user_jd_cookies == null) {
          // 云端没有用户的Cookies信息,获取中...
        } else {
          // 云端存有用户Cookies信息,直接使用

          var weChatuserInfo_Updated = {
            nickName: "weChatuserInfo.nickName",
            openid: weChatuserInfo._openid,
            user_jd_cookies: res.data[0].user_jd_cookies,
            user_jd_inviteId: res.data[0].user_jd_inviteId,
            user_jd_levelName: res.data[0].user_jd_levelName,
            user_jd_nickname: res.data[0].user_jd_nickname,
            user_jd_userLevel: res.data[0].user_jd_userLevel,
          }
        }
      })
    }




  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()
  },
})