import Koa from 'koa'

import views from 'koa-views'
import json from 'koa-json'
import bodyparser from 'koa-bodyparser'
import koaLogger from 'koa-logger'
import path from 'path'
// import proxy from 'http-proxy-middleware'
// import k2c from 'koa2-connect'
// import Router from 'koa-router'
import log4js from 'log4js'

import ErrorHandler from './middlewares/error'
import config from './config/index'
import indexRoute from './routes/index'
import usersRoute from './routes/users'
import libraryRoute from './routes/library'

const app = new Koa()

//转发
// var router = new Router()
// router.post('/yii-basic/web/index.php', 
//   k2c(
//     proxy({
//       target: 'http://localhost/',
//       // target: 'https://api.github.com/',
//       changeOrigin:true
//     })
//   )
// )
// app.use(router.routes())

log4js.configure({
  appenders: { cheese: { type: 'file', filename: path.resolve(__dirname,'../../log/error.log')} },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger('cheese');

//404错误页面
ErrorHandler.error404(app,logger)

// 错误处理函数 同步操作 error handler
ErrorHandler.error500(app,logger)


app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(koaLogger())
app.use(require('koa-static')(config.staticDir,{
  // maxage: 24 * 60 * 60
  maxage: 0
}))

app.use(views(config.viewDir, {
  extension: 'pug',
  cache: true
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(indexRoute.routes(), indexRoute.allowedMethods())
app.use(usersRoute.routes(), usersRoute.allowedMethods())
app.use(libraryRoute.routes(), libraryRoute.allowedMethods())

// 错误处理 error-handling 一般打印日志
app.on('error', async (err, ctx) => {
  console.error("err:",err)
});

module.exports = app
