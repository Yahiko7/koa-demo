基于koa-generator脚手架搭建的项目
### koa 项目搭建： 
```
koa 脚手架
npm install koa-generator -g
koa2 my-project
cd my-project
npm installgit 代码仓库
```
koa项目依赖：
koa-views  //模版渲染 
koa-statics  // 静态资源文件


### 引入babel
如何快速进行babel？
开发环境下通过babel-node
1、安装babel-cli 和 babel-preset-env（<babel7.0）

2、.babelrc文件
```
{
  "presets": [
    [
      "env",
      {
        "target":{
          "node": "current"
        }
      }
    ]
  ]
}
```
babel编译js文件
```
babel-node src/index.js --presets env
```
开发环境下实时监听node文件改动，自动重启：nodemon

实时编译es6写法

```
./node_modules/.bin/nodemon bin/www.js --exec babel-node --presets env bin/www.js
// --exec 替代当前的进程 
```
### 静态资源强制缓存
```
// koa-static 配置
app.use(require('koa-static')(config.staticDir,{
  maxage: 24 * 60 * 60
}))
```

### 错误处理
404错误处理
```
app.use(async function pageNotFound(ctx,next) {
  // we need to explicitly set 404 here
  // so that koa doesn't assign 200 on body=
  await next();
  if(ctx.status ===  404){
    switch (ctx.accepts('html', 'json')) {
      case 'html':
        ctx.type = 'html';
        ctx.body = '<p>Page Not Found</p>';
        break;
      case 'json':
        ctx.body = {
          message: 'Page Not Found'
        };
        break;
      default:
        ctx.type = 'text';
        ctx.body = 'Page Not Found';
    }
  }
});
```
500错误页面
```
app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) ctx.throw(404)
  } catch (err) {
    console.error(err)
    ctx.status = err.status || 500
    ctx.body = errorPug({
      title: '服务器维护中',
      message: err.message,
      error:{
        status: 500,
        stack: err.stack
      }
    })
  }
})
```

koa-onerror处理500页面	
```
onerror(app,{
  accepts() {
    return 'html';
  },
  html(err, ctx) {
    ctx.body = errorPug({
      title: '服务器维护中',
      message: err.message,
      error:{
        status: 500,
        stack: err.stack
      }
    })
  }
})
```
### 日志记录
pm2方式
```
console.log -> pm2 -> pm2-logrotate 切割
```
log4js，比较标准化
```
const log4js = require('log4js');

//配置
log4js.configure({
  appenders: { cheese: { type: 'file', filename: path.resolve(__dirname,'../log/error.log')} },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger('cheese');

//打印
logger.error('aaaa')

```

### 模版引擎 
注意模版引擎要开启script标签转译，防止xss
```
koa-swig autoescape设置为true
app.context.render = render({
  root: path.join(__dirname, 'views'),
  autoescape: true,
  cache: 'memory', // disable, set to false
  ext: 'html',
  locals: locals,
  filters: filters,
  tags: tags,
  extensions: extensions
});
```
如何使用的是koa-views，它已经自动转义了

### koa洋葱模型
```
// #1
app.use(async (ctx, next)=>{
    console.log(1)
    await next();
    console.log(1)
});
// #2
app.use(async (ctx, next) => {
    console.log(2)
    await next();
    console.log(2)
})

app.use(async (ctx, next) => {
    console.log(3)
})
```



控制台打印:
```
1
2
3
2
1
```


koa-swig 编写：
```
import render from "koa-swig";
import { wrap } from 'co';

app.context.render = wrap(render({
    root: viewDir,
    autoescape: true, //注意这个配置项目
    cache: false,
    ext: 'html',
    writeBody: false
}));
```

### koa 处理转发
使用http-proxy-middleware中间件
```
//转发
const Router = require('koa-router');
const k2c = require('koa2-connect');
const proxy = require('http-proxy-middleware');
const router = new Router()
router.post('/yii-basic/web/index.php', 
  k2c(
    proxy({
      target: 'http://localhost/',
      // target: 'https://api.github.com/',
      changeOrigin:true
    })
  )
)
app.use(router.routes())
```

问题：
koa 如何用js对象方法操作sql？
koa 如何处理转发?