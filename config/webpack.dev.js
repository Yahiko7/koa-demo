
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.js')

const devConfig = {
  mode: 'development',
  watch: true
}

module.exports = merge(webpackBaseConfig,devConfig)