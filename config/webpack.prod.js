const path = require('path')
const merge = require('webpack-merge')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const webpackBaseConfig = require('./webpack.base.js')


const prodConfig = {
  mode: 'production',
  output: {
    path: path.resolve('../dist/web'),
    filename: 'public/js/[name].[contenthash:5].js',
    publicPath: '/'
  },
  plugins: [
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
  ]
}

module.exports = merge(webpackBaseConfig,prodConfig)