// 云函数入口文件
const cloud = require('wx-server-sdk')
var requestPromise = require('request-promise')
cloud.init()

// 云函数入口函数
var s_token, cookies
exports.main = async (event, context) => {
  var timeStamp = (new Date()).getTime()
  return new Promise((resolve, reject) => {
    // 在 3 秒后返回结果给调用方（小程序 / 其他云函数）
    console.log(event.cookies)
    cookies = event.cookies
    var mGet = {
      uri: 'https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2&g_login_type=1&callback=',
      headers: {
        'Connection': 'Keep-Alive',
        'Accept': '*/*',
        'Cookie': cookies,
        'Referer': 'https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2&g_login_type=1&callback=',
        'User-Agent': 'jdapp;iPhone;9.2.0;13.5;;network/wifi;ADID/;JDEbook/openapp.jdreader;supportApplePay/3;hasUPPay/1;pushNoticeIsOpen/1;model/iPhone10,3;addressid/;hasOCPay/0;appBuild/167408;supportBestPay/0;jdSupportDarkMode/0;pv/1070.27;apprpd/Home_Main;ref/JDMainPageViewController;psq/11;ads/;psn/|2612;jdv/0|kong||jingfen||;adk/;app_device/IOS;pap/JA2015_311210|9.2.0|IOS 13.5;Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
        'Host': 'wq.jd.com'
      },
      json: true,
      resolveWithFullResponse: true
    };
    requestPromise(mGet)
      .then(function (response) {
        console.log(response)
        resolve({
          'response': response,
        })
      })
  })
}