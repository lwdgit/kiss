const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
var config = require('./webpack.config.js')
config.entry.app.unshift('webpack-dev-server/client?http://localhost:8080/')
var compiler = webpack(config)
var server = new WebpackDevServer(compiler, {
  hot: true,
  contentBase: '../'
})
server.listen(8080)
