class BooksServices {
  constructor(app){

  }

  getData(options){
    return new Promise((resolve,reject) => {
      resolve({
        data: [
          { bookId: 1 , bookPrice: 20, author : "张三", bookName: '《JavaScript权威指南》'  },
          { bookId: 22 , bookPrice: 80, author : "李四" , bookName: '《CSS权威指南》'  },
          { bookId: 12 , bookPrice: 290, author : "老吴" , bookName: '《HTTP权威指南》'  },
          { bookId: 1213 , bookPrice: 32, author : "小张" , bookName: '《图解HTTP》'  },
          { bookId: 242 , bookPrice: 92, author : "老王" , bookName: '《深入浅出Nodejs》'  }
        ]
      })
    })
  }
}

export default BooksServices;