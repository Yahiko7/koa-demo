const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')

const bodyparser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const path = require('path');
const index = require('../routes/index')
const users = require('../routes/users')
const library = require('../routes/library')
const proxy = require('http-proxy-middleware');
const k2c = require('koa2-connect');
const Router = require('koa-router');
const log4js = require('log4js');

const ErrorHandler = require('./middlewares/error') 

const config = require('./config/index')

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
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(library.routes(), library.allowedMethods())

// 错误处理 error-handling 一般打印日志
app.on('error', async (err, ctx) => {
  console.error("err:",err)
});

module.exports = app
