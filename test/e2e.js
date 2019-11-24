const Rize = require('rize')
const rize = new Rize()
rize
  .goto('http://localhost:3000/library/list')
  .waitForNavigation()
  .assertTitle('图书管理系统')
  .end() 