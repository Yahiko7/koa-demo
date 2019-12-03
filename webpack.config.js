const path = require('path');
const entryGlob = require('glob').sync("./src/views/entry/*.js")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AfterHtmlPlugin = require('./plugins/AfterHtmlPlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const entryFiles = {};
const htmlPlugins = [];
entryGlob.map(filename => {
  const entryname = /([a-zA-Z]+-[a-zA-Z]+)\.js/.exec(filename)[1];
  entryFiles[`${entryname}`] = filename;
  htmlPlugins.push(
    new HtmlWebpackPlugin({
      template: `./src/views/pages/${entryname}.pug`,
      filename: `../views/pages/${entryname}.pug`,
      inject: false,
      chunks: entryname
    })
  )
})

module.exports = {
  mode: 'development',
  entry: entryFiles,
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname,'./dist/public'),
    publicPath: '/'
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
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
            },
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ],
  },
  plugins: [
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
    new AfterHtmlPlugin(),
  ]
};