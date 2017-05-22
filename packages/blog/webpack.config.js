const webpack = require('webpack')
const { join } = require('path')
const { rm } = require('shelljs')
const WebpackMd5Hash = require('webpack-md5-hash')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')


const isProd = process.argv.slice(-1)[0] === '-p'

isProd && rm('-rf', join(__dirname, './dist'))

module.exports = {
  entry: {
    dev: 'webpack/hot/dev-server',
    app: [
      './blog.js' 
    ]
  },
  devtool: '#cheap-module-eval-source-map',
  output: {
    path: join(__dirname),
    // publicPath: './src/',
    filename: isProd ? './dist/js/[name].[chunkhash].js' : './dist/js/[name].js',
    chunkFilename: './dist/js/[id].[chunkhash].js'
  },
  module: {
    rules: [
      {
        // set up standard-loader as a preloader
        enforce: 'pre',
        test: /\.js$/,
        loader: 'standard-loader',
        exclude: /\/(node_modules|bower_components|sw|third_party|js\/)/,
        options: {
          // Emit errors instead of warnings (default = false)
          error: false,
          // enable snazzy output (default = true)
          snazzy: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: false
          }
        }, {
          loader: 'less-loader',
          options: {
            sourceMap: false
          }
        }, {
          loader: 'postcss-loader'
        }]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader']
        })
      },
      {
        test: /\.png$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new WebpackMd5Hash(),
    //new HtmlWebpackInlineSourcePlugin(),
    new ExtractTextPlugin({
      filename: './dist/[name].[chunkhash].css',
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      filename: '../app.html',
      template: 'src/template.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      inlineSource: 'manifest.*.js$', // 注意加上这一句
      chunks: ['manifest', 'vendor', 'app'],
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.userRequest &&
          (/\.js$/.test(module.userRequest) &&
          module.userRequest.indexOf(
            join(__dirname, './node_modules')
          ) === 0 || ~module.userRequest.indexOf('third_party'))
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    new FriendlyErrorsPlugin()
  ]
}
