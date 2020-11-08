// 云函数入口文件
const cloud = require('wx-server-sdk')
var requestPromise = require('request-promise')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var timeStamp = (new Date()).getTime()
  return new Promise((resolve, reject) => {
    // 在 3 秒后返回结果给调用方（小程序 / 其他云函数）
    console.log(event.token)
    console.log(event.okl_token)
    console.log(event.cookies)
    timeStamp = (new Date()).getTime()
    var mPost = {
      method: 'POST',
      uri: 'https://plogin.m.jd.com/cgi-bin/m/tmauthchecktoken?&token=' + event.token + '&ou_state=0&okl_token=' + event.okl_token,
      form: {
        lang: 'chs',
        appid: 300,
        returnurl: 'https://wqlogin2.jd.com/passport/LoginRedirect?state=1100399130787&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action',
        source: 'wq_passport'
      },
      headers: {
        'Referer': 'https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=' + timeStamp + '&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
        'Cookie': event.cookies,
        'Connection': 'Keep-Alive',
        'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
      },
      json: true, // Automatically stringifies the body to JSON
      resolveWithFullResponse: true
    };
    console.log(mPost.uri)
    requestPromise(mPost)
      .then(function (response) {
        console.log(response)
        resolve({
          'response': response,
        })
      })
  })
}