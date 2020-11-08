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
      uri: 'https://api.m.jd.com/client.action?functionId=stall_getHomeData',
      form: {
        'functionId': 'stall_getHomeData',
        'body': '{"inviteId":"' + event.inviteId + '"}',
        'client': 'wh5',
        'clientVersion': '1.0.0',
      },
      headers: {
        'user-agent': 'jdapp;android;9.2.2;7.1.2;865166027278277-020000000000;network/wifi;model/RMX1931;addressid/0;aid/ce8eb307aec29d9b;oaid/;osVer/25;appBuild/85371;psn/865166027278277-020000000000|17;psq/14;uid/865166027278277-020000000000;adk/;ads/;pap/JA2015_311210|9.2.2|ANDROID 7.1.2;osv/7.1.2;pv/17.16;jdv/;ref/https://wbbny.m.jd.com/babelDiy/Zeus/4SJUHwGdUQYgg94PFzjZZbGZRjDd/index.html?shareType=homeTask&inviteId=' + event.inviteId + '&mpin=RnFlkDILO2DczNRP--twWPARD5Q0iNkUrmmW&lng=116.41025&lat=39.916411&sid=8b80bfe2ef98b0377fe0d357eb2076aw&un_area=1_2802_2821_0;partner/lc001;apprpd/Home_Main;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 7.1.2; RMX1931 Build/N2G48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.70 Safari/537.36',
        'content-type': 'application/x-www-form-urlencoded',
        'referer': 'https://wbbny.m.jd.com/babelDiy/Zeus/4SJUHwGdUQYgg94PFzjZZbGZRjDd/index.html?shareType=homeTask&inviteId=Vl4ISddtQiRcKaxh8Wz7MmftwcNG7JLFQmk44-5reuwgBqkhLwiQAsY&mpin=RnE1kGVYYT3eydRP--txXKyV4nJdPfZswlP8&lng=116.41025&lat=39.916411&sid=8b80bfe2ef98b0377fe0d357eb2076aw&un_area=1_2802_2821_0',
        'cookie': '"TrackerID=25tmjQmGk8VX9Zn1qYbNz_pFRaWC5agc9_-yB9DdFX0AJDrlvn6oK35KWywLvu08xBHrUmrFdZec41-gQ6DDZiFN-gRHb47VeQoVBUTRbnE; pt_key=AAJfp6CbADBVO-llIiIpPL9NytNYJkoZEv7SpP7o9aD7qcghqIYWH8Yp--QgfD6GVhtB7AbxGKY; pt_pin=jd_61825895ef3bc; pt_token=r092iqym; pwdt_id=jd_61825895ef3bc; s_key=AAJfp6CbADAG8XZPmayYaFvoVC_tJfN3BGFWrVIj6odVVnv0HC_YoYnJVCpnoR4iKCXXf4-kgps; s_pin=jd_61825895ef3bc; wq_skey="'
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