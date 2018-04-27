
module.exports = {
  // 已经登录了
  checkNotLogin: (ctx) => {
    if (ctx.session && ctx.session.user) {
      ctx.throw(401, 'has login', { user: ctx.session.user })
      // ctx.redirect('/string')
      return false
    }
    return true
  },
  // 没有登录
  checkLogin: (ctx) => {
    if (!ctx.session || !ctx.session.user) {
      console.log('has not login!')
      ctx.redirect('/string')
      return false
    }
    return true
  }
}
