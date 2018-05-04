const checkLogin = require('../middleware/checkLogin')
const User = require('../model').user
const UserClass = require('../model').userClass
var debug = require('debug')('koa2Demo:userService')

// 检查用户是否不存在
let checkNotExist = (ctx) =>
  new Promise((resolve, reject) => {
    User.findOne({
      where: { account: ctx.request.body.account }
    }).then(user => {
      if (user) {
        var u = new UserClass(user)
        debug(u)
        reject(new Error('该用户已存在'))
      } else {
        resolve()
      }
    })
  })

// 登录
let login = (ctx) => new Promise((resolve, reject) => {
  var acct = ctx.request.body.acct || ctx.request.query.acct
  var pwd = ctx.request.body.pwd || ctx.request.query.pwd
  User.findOne({
    where: {
      account: acct
    }
  }).then(user => {
    if (!user) {
      reject(new Error('用户不存在！'))
    } else if (user.password !== pwd) {
      reject(new Error('密码错误！'))
    }
    ctx.session.user = user
    resolve({ message: '登录成功！' })
  })
})

module.exports = {
  // 注册
  register: async (ctx, next) => {
    await checkLogin.checkNotLogin(ctx)
    await checkNotExist(ctx)
      .then(() => {
        User.create({ account: ctx.request.body.account, password: ctx.request.body.account })
        ctx.body = '注册成功！'
      })
      .catch(() => {
        ctx.body = '该用户已存在'
      })
  },
  // 登录
  login: async (ctx, next) => {
    await checkLogin.checkNotLogin(ctx)
    await login(ctx)
      .then((ret) => {
        ctx.body = ret.message
      })
      .catch((ret) => {
        ctx.body = ret.message
      })
  }
}
