import { route, GET, POST} from 'awilix-koa'

@route("/library")
class LibraryControll{

  constructor({booksServices}){
    this.booksServices = booksServices;
  }

  @route("/list")
  @GET()
  async actionList(ctx,next){
    let result = await this.booksServices.getData() 
    await ctx.render('book-list', {
      books: result.data
    })
  }

  @route('/add')
  @GET()
  async asyncAdd(ctx,next){
    await ctx.render('book-create',{
      title: '添加图书'
    })
  }

  
}

export default LibraryControll