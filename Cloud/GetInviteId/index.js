// 云函数入口文件
const cloud = require('wx-server-sdk')
var requestPromise = require('request-promise')
cloud.init()

// 云函数入口函数
var s_token, cookies
exports.main = async (event, context) => {
  var timeStamp = (new Date()).getTime()
  return new Promise((resolve, reject) => {
    console.log(event)
    cookies = event.cookies
    var mPost = {
      method: 'POST',
      uri: 'https://api.m.jd.com/client.action?functionId=stall_getTaskDetail',
      form: {
        'functionId': 'stall_getTaskDetail',
        'body': {"shopSign":""},
        'client': 'wh5',
        'clientVersion': '1.0.0'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json, text/plain, */*',
        'Cookie': cookies,
        'Referer': 'https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=' + timeStamp + '&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
        'User-Agent': 'jdapp;android;9.2.2;7.1.2;865166027278277-020000000000;network/wifi;model/RMX1931;addressid/0;aid/ce8eb307aec29d9b;oaid/;osVer/25;appBuild/85371;psn/865166027278277-020000000000|11;psq/13;uid/865166027278277-020000000000;adk/;ads/;pap/JA2015_311210|9.2.2|ANDROID 7.1.2;osv/7.1.2;pv/11.15;jdv/;ref/com.jingdong.app.mall.home.JDHomeFragment;partner/lc001;apprpd/Home_Main;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 7.1.2; RMX1931 Build/N2G48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.70 Mobile Safari/537.36',
        'Host': 'api.m.jd.com',
      },
      json: true, // Automatically stringifies the body to JSON
      resolveWithFullResponse: true
    };
    requestPromise(mPost)
      .then(function (response) {
        console.log("response:" + response);
        var inviteId = response.body.data.result.inviteId
        console.log("inviteId:" + inviteId);
        resolve({
          'inviteId': inviteId,
        })
      })
  })
}