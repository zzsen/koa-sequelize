const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path')

const debug = require('debug')('koa2Demo:app')

const index = require('./routes/index')
const users = require('./routes/users')

const getConfig = require('./config/getConfig')

// session-middleware
const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')
var mysqlConfig = getConfig('mysql')
// 配置存储session信息的mysql
let sessionStore = new MysqlStore({
  user: mysqlConfig.username,
  password: mysqlConfig.password,
  database: mysqlConfig.database,
  host: mysqlConfig.host
})
// 存放sessionId的cookie配置
// let cookie = {
//   maxAge: '', // cookie有效时长
//   expires: '', // cookie失效时间
//   path: '', // 写cookie所在的路径
//   domain: '', // 写cookie所在的域名
//   httpOnly: '', // 是否只用于http请求中获取
//   overwrite: '', // 是否允许重写
//   secure: '',
//   sameSite: '',
//   signed: ''
// }

// 使用session中间件
app.use(session({
  key: 'SESSION_ID',
  store: sessionStore,
  cookie: ctx => ({
    maxAge: ctx.session.user ? 1000 * 60 : 0
  })
}))

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    ctx.response.status = e.statusCode || e.status || 500
    ctx.body = e.message
  }
})
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(path.join(__dirname, 'public')))

app.use(views(path.join(__dirname, 'views'), {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  debug(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  ctx.body = err.message
  debug('server error', err, ctx)
})

module.exports = app
