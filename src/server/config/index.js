const path = require('path');
export default {
  staticDir : path.resolve(__dirname,"../../web/public"),
  viewDir: path.resolve(__dirname,'../../web/pages')
}

if (process.env.NODE_ENV == 'development') {
  const localConfig = {
    port: 8082,
    baseUrl: 'http://localhost:8080/'
  }
  console.log(prodConfig)
}
if (process.env.NODE_ENV == 'production') {
  const prodConfig = {
    port: 80
  }
  console.log(prodConfig)
}