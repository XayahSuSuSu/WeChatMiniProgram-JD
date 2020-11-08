// 云函数入口文件
const cloud = require('wx-server-sdk')
var requestPromise = require('request-promise')
cloud.init()

// 云函数入口函数
var s_token, cookies, guid, lsid, lstoken, okl_token, token
exports.main = async (event, context) => {
  var timeStamp = (new Date()).getTime()
  return new Promise((resolve, reject) => {
    // 在 3 秒后返回结果给调用方（小程序 / 其他云函数）
    var mGet = {
      uri: 'https://plogin.m.jd.com/cgi-bin/mm/new_login_entrance?lang=chs&appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=' + timeStamp + '&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
      headers: {
        'Connection': 'Keep-Alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-cn',
        'Referer': 'https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=' + timeStamp + '&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
        'Host': 'plogin.m.jd.com'
      },
      json: true,
      resolveWithFullResponse: true
    };
    requestPromise(mGet)
      .then(function (response) {
        s_token = response.body.s_token
        guid = response.headers['set-cookie'][0]
        guid = guid.substring(guid.indexOf("=") + 1, guid.indexOf(";"))
        lsid = response.headers['set-cookie'][2]
        lsid = lsid.substring(lsid.indexOf("=") + 1, lsid.indexOf(";"))
        lstoken = response.headers['set-cookie'][3]
        lstoken = lstoken.substring(lstoken.indexOf("=") + 1, lstoken.indexOf(";"))
        cookies = "guid=" + guid + "; lang=chs; lsid=" + lsid + "; lstoken=" + lstoken + "; "
        console.log("s_token:" + s_token);
        console.log("cookies:" + cookies);
        timeStamp = (new Date()).getTime()
        var mPost = {
          method: 'POST',
          uri: 'https://plogin.m.jd.com/cgi-bin/m/tmauthreflogurl?s_token=' + s_token + '&v=' + timeStamp + '&remember=true',
          form: {
            'lang': 'chs',
            'appid': 300,
            'returnurl': 'https://wqlogin2.jd.com/passport/LoginRedirect?state=' + timeStamp + '&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action',
            'source': 'wq_passport'
          },
          headers: {
            'Connection': 'Keep-Alive',
            'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
            'Accept': 'application/json, text/plain, */*',
            'Cookie': cookies,
            'Referer': 'https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=' + timeStamp + '&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
            'Host': 'plogin.m.jd.com',
          },
          json: true, // Automatically stringifies the body to JSON
          resolveWithFullResponse: true
        };
        requestPromise(mPost)
          .then(function (response) {
            token = response.body.token
            okl_token = response.headers['set-cookie'][0]
            okl_token = okl_token.substring(okl_token.indexOf("=") + 1, okl_token.indexOf(";"))
            console.log("token:" + token);
            console.log("okl_token:" + okl_token);
            resolve({
              'token': token,
              'okl_token': okl_token,
              "cookies": cookies,
            })
          })
      })
  })
}