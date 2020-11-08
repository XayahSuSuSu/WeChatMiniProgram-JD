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
      uri: 'https://api.m.jd.com/client.action?functionId=stall_collectScore',
      form: {
        'functionId':'stall_collectScore',
        'body':'{"taskId":"2","itemId":"'+event.itemId+'","ss":"{\"extraData\":{\"is_trust\":true,\"sign\":\"3B7726FD02F33E02FDBBE7EF933825A5ED9D85B43148A98C8F0A7C2A28802897\",\"fpb\":\"\",\"time\":1604824624652,\"encrypt\":\"6\",\"nonstr\":\"ngX9Uyv571\",\"jj\":\"\",\"token\":\"b17edb5acc421aece201bd97a7cb713f\",\"cf_v\":\"1.0.1\",\"client_version\":\"2.1.3\",\"call_stack\":\"b5eb95a06440a7f0586bc53ca5a547dd\",\"session_c\":\"16048246246237196\",\"buttonid\":\"jmdd-react-smash_0\",\"sceneid\":\"mainTaskh5\",\"appid\":\"50073\"},\"businessData\":{\"taskId\":\"2_143668\",\"rnd\":\"655676\",\"inviteId\":\"'+event.inviteId+'\",\"stealId\":\"-1\"},\"secretp\":\"'+event.secretp+'\"}","inviteId":"'+event.inviteId+'"}',
        'client':'wh5',
        'clientVersion':'1.0.0'
      },
      headers: {
        'user-agent': 'jdapp;android;9.2.2;7.1.2;865166027278277-020000000000;network/wifi;model/RMX1931;addressid/0;aid/ce8eb307aec29d9b;oaid/;osVer/25;appBuild/85371;psn/865166027278277-020000000000|18;psq/17;uid/865166027278277-020000000000;adk/;ads/;pap/JA2015_311210|9.2.2|ANDROID 7.1.2;osv/7.1.2;pv/18.18;jdv/;ref/com.jd.lib.personal.view.fragment.JDPersonalFragment;partner/lc001;apprpd/MyJD_Main;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 7.1.2; RMX1931 Build/N2G48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.70 Safari/537.36',
        'content-type': 'application/x-www-form-urlencoded',
        'referer': 'https://wbbny.m.jd.com/babelDiy/Zeus/4SJUHwGdUQYgg94PFzjZZbGZRjDd/index.html?shareType=homeTask&inviteId=' + event.inviteId + '&mpin=RnFlkDILO2DczNRP--twWPARD5Q0iNkUrmmW&sid=90ff6f62f2567e52a2a797b5fd3661cw&un_area=1_2802_2821_0',
        'cookie': event.cookies
      },
      json: true, // Automatically stringifies the body to JSON
      resolveWithFullResponse: true
    };
    requestPromise(mPost)
      .then(function (response) {
        console.log("response:" + JSON.stringify(response));
        resolve({
          'response': JSON.stringify(response),
        })
      })
  })
}