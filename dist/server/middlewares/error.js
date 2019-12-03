const onerror = require('koa-onerror');
const path = require('path');
const pug = require('pug')
const errorPug = pug.compileFile(path.resolve(__dirname,'../../views/pages/error.pug'))
module.exports =  {
  error404(app,logger){
    app.use(async function pageNotFound(ctx,next) {
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
  },
  error500(app,logger){
    onerror(app,{
      accepts() {
        return 'html';
      },
      html(err, ctx) {
        logger.error(err)
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

    //手写500错误页面
    // app.use(async (ctx, next) => {
    //   try {
    //     await next()
    //     if (ctx.status === 404) ctx.throw(404)
    //   } catch (err) {
    //     console.error(err)
    //     ctx.status = err.status || 500
    //     ctx.body = errorPug({
    //       title: '服务器维护中',
    //       message: err.message,
    //       error:{
    //         status: 500,
    //         stack: err.stack
    //       }
    //     })
    //   }
    // })
  }
}

