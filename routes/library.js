const router = require('koa-router')()
const axios = require('axios')

router.get('/library/list', async (ctx, next) => {

  let books = await axios.get('/yii-basic/web/index.php?r=library2/list')
  await ctx.render('list', {
    title: '图书管理系统',
    books: books.data.data
  })
})

router.get('/library/add',async (ctx,next) => {
  await ctx.render('add', {
    // title: '添加图书'
    title: '<script>alert("aaas")</script>'
  })
})
//转发请求，进行代理
// router.post('/library/add',async (ctx,next) => {
//   await ctx.render('add', {
//     title: '添加图书'
//   })
// })

router.get('/test', async (ctx, next) => {
  ctx.body = 'koa2 string22'
})


module.exports = router
