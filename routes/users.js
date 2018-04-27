const router = require('koa-router')()
const User = require('../model').user
const checkLogin = require('../middleware/checkLogin')
const userservice = require('../service/userService')

router.prefix('/users')

router.get('/', async (ctx, next) => {
  await checkLogin.checkLogin(ctx)
  await ctx.redirect('/users/login')
})

router.post('/register', async (ctx, next) => {
  await checkLogin.checkNotLogin(ctx)
  await userservice.checkExist(ctx)
    .then(() => {
      User.create({ account: ctx.request.body.account, password: ctx.request.body.account })
      ctx.body = '注册成功！'
    })
    .catch(() => {
      ctx.body = '该用户已存在'
    })
})

router.get('/login', async (ctx, next) => {
  await checkLogin.checkNotLogin(ctx)
  await userservice.login(ctx)
    .then((ret) => {
      ctx.body = ret.msg
    })
    .catch((ret) => {
      ctx.body = ret.msg
    })
})
router.post('/login', async (ctx, next) => {
  await checkLogin.checkNotLogin(ctx)
  await userservice.login(ctx)
    .then((ret) => {
      ctx.body = ret.msg
    })
    .catch((ret) => {
      ctx.body = ret.msg
    })
})

router.get('/signin', (ctx, next) => {
  console.log('4')
  ctx.body = 'has not login'
})

router.get('/bar', async (ctx, next) => {
  await checkLogin.checkLogin(ctx)
  await ctx.render('index', { title: 'has login ' })
})

module.exports = router
