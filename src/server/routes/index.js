import { route, GET } from 'awilix-koa'

@route("/")
class IndexController{
  @route("/")
  @GET()
  async actionIndex(ctx,next){
    
    await ctx.render('index', {
      title: 'Hello Koa !'
    })

  }

  @route("/string")
  @GET()
  async actionString(ctx,next){

    ctx.body = 'Hello String'
  }
}

export default IndexController
