"use strict";

var _koa = _interopRequireDefault(require("koa"));

var _koaViews = _interopRequireDefault(require("koa-views"));

var _koaJson = _interopRequireDefault(require("koa-json"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _koaLogger = _interopRequireDefault(require("koa-logger"));

var _path = _interopRequireDefault(require("path"));

var _log4js = _interopRequireDefault(require("log4js"));

var _error = _interopRequireDefault(require("./middlewares/error"));

var _index = _interopRequireDefault(require("./config/index"));

var _index2 = _interopRequireDefault(require("./routes/index"));

var _users = _interopRequireDefault(require("./routes/users"));

var _library = _interopRequireDefault(require("./routes/library"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import proxy from 'http-proxy-middleware'
// import k2c from 'koa2-connect'
// import Router from 'koa-router'
const app = new _koa.default(); //转发
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

_log4js.default.configure({
  appenders: {
    cheese: {
      type: 'file',
      filename: _path.default.resolve(__dirname, '../../log/error.log')
    }
  },
  categories: {
    default: {
      appenders: ['cheese'],
      level: 'error'
    }
  }
});

const logger = _log4js.default.getLogger('cheese'); //404错误页面


_error.default.error404(app, logger); // 错误处理函数 同步操作 error handler


_error.default.error500(app, logger);

app.use((0, _koaBodyparser.default)({
  enableTypes: ['json', 'form', 'text']
}));
app.use((0, _koaJson.default)());
app.use((0, _koaLogger.default)());
app.use(require('koa-static')(_index.default.staticDir, {
  // maxage: 24 * 60 * 60
  maxage: 0
}));
app.use((0, _koaViews.default)(_index.default.viewDir, {
  extension: 'pug',
  cache: true
})); // logger

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
}); // routes

app.use(_index2.default.routes(), _index2.default.allowedMethods());
app.use(_users.default.routes(), _users.default.allowedMethods());
app.use(_library.default.routes(), _library.default.allowedMethods()); // 错误处理 error-handling 一般打印日志

app.on('error', async (err, ctx) => {
  console.error("err:", err);
});
module.exports = app;