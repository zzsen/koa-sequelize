const router = require('koa-router')()
// const User = require('../model').user
const checkLogin = require('../middleware/checkLogin')
const userservice = require('../service/userService')

router.prefix('/users')

// 注册
router.post('/register', userservice.register)

// 登录
router.get('/login', userservice.login)
router.post('/login', userservice.login)

router.get('/signin', (ctx, next) => {
  console.log('4')
  ctx.body = 'has not login'
})

router.get('/bar', async (ctx, next) => {
  await checkLogin.checkLogin(ctx)
  await ctx.render('index', { title: 'has login ' })
})

module.exports = router
