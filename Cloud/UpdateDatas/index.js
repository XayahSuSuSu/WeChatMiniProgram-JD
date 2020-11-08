// 云函数入口文件
const cloud = require('wx-server-sdk')
 
cloud.init()
 
const db = cloud.database()
const _ = db.command
 
// 云函数入口函数
exports.main = async (event, context) => {
 try {
  return await db.collection('userInfo').where({
    _openid: event.openid,
  }).update({
   // data 传入需要局部更新的数据
   data: {
    user_jd_info: JSON.stringify(event.user_jd_info)
   }
  })
 } catch (e) {
  console.error(e)
 }
}
