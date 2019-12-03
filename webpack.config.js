const path = require('path');
const entryGlob = require('glob').sync("./src/views/entry/*.js")

const entryFiles = {};
entryGlob.map(filename => {
  const entryname = /([a-zA-Z]+-[a-zA-Z]+)\.js/.exec(filename)[1];
  entryFiles[`${entryname}`] = filename;
})


module.exports = {
  mode: 'development',
  entry: entryFiles,
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname,'./dist/assets') 
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  }
};