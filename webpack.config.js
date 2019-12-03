const path = require('path')
const glob = require('glob')
const entryGlob = glob.sync("./src/web/entry/*.js")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AfterHtmlPlugin = require('./plugins/AfterHtmlPlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const yargs = require("yargs")
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const env = yargs.argv.mode || 'development'

const configObj = env === 'development' ? require('./config/webpack.dev.js') : require('./config/webpack.prod.js')


const entryFiles = {};
const htmlPlugins = [];
entryGlob.map(filename => {
  const entryname = /([a-zA-Z]+-[a-zA-Z]+)\.js/.exec(filename)[1];
  entryFiles[`${entryname}`] = filename;
  htmlPlugins.push(
    new HtmlWebpackPlugin({
      template: `./src/web/pages/${entryname}.pug`,
      filename: `pages/${entryname}.pug`,
      inject: false,
      chunks: entryname
    })
  )
})

console.log(`./src/web/pages/*!(${Object.keys(entryFiles).join("|")}).pug`)
const testFiles = glob.sync(`./src/web/pages/!(${Object.keys(entryFiles).join("|")}).pug`)
console.log(testFiles)

const baseConfig = {
  mode: env,
  entry: entryFiles,
  output: {
    filename: 'public/js/[name].bundle.js',
    path: path.resolve(__dirname,'./dist/web'),
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
    // new CleanWebpackPlugin({
    //   cleanOnceBeforeBuildPatterns: ['./dist/**/*']
    // }),
    new webpack.ProgressPlugin(),
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: 'public/css/[name].css',
    }),
    new AfterHtmlPlugin(),
    new CopyWebpackPlugin([
      { from: './src/web/components', to: 'components' },
      { from: './src/web/layouts', to: 'layouts' },
      { from: './src/web/public', to: 'public' },
      { from: `!(${Object.keys(entryFiles).join("|")}).pug`,context: "./src/web/pages/", to: 'pages' },
    ]),
    // new CleanWebpackPlugin({
    //   cleanOnceBeforeBuildPatterns: ['./dist/web'],
    // }),
  ]
};

module.exports = merge(baseConfig,configObj)