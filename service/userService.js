
const User = require('../model').user
module.exports = {
  // 已经登录了
  checkExist: (ctx) => new Promise((resolve, reject) => {
    User.findOne({
      where: { account: ctx.request.body.acct }
    }).then(user => {
      if (user) {
        reject(false)
      } else {
        resolve(true)
      }
    })
  }),
  login: (ctx) => new Promise((resolve, reject) => {
    var acct = ctx.request.body.acct || ctx.request.query.acct
    var pwd = ctx.request.body.pwd || ctx.request.query.pwd
    User.findOne({
      where: {
        account: acct
      }
    }).then(user => {
      if (!user) { reject({ success: false, msg: '用户不存在！' }) } else if (user.password !== pwd) { reject({ success: false, msg: '密码错误！' }) }
      // delete user.password
      // console.log(user.password)
      // console.log(pwd)
      ctx.session.user = user
      resolve({ success: true, msg: '登录成功！' })
    })
  })
}
