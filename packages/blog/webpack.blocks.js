const { addPlugins, createConfig, defineConstants, env, entryPoint, setOutput, sourceMaps, webpack } = require('@webpack-blocks/webpack2')
const babel = require('@webpack-blocks/babel6')
// const extractText = require('@webpack-blocks/extract-text2')
const devServer = require('@webpack-blocks/dev-server2')
const postcss = require('@webpack-blocks/postcss')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const { rm } = require('shelljs')

const less = function (options) {
  'use strict'
  options = options || {}

  const hasOptions = Object.keys(options).length > 0

  return (context) => ({
    module: {
      loaders: [
        {
          test: context.fileType('text/x-less'),
          loaders: [
            'style-loader',
            options.sourceMap ? 'css-loader?sourceMap' : 'css-loader',
            hasOptions ? 'less-loader?' + JSON.stringify(options) : 'less-loader'
          ]
        }
      ]
    }
  })
}

var htmlConfig = {
  inject: true,
  filename: '../../app.html',
  template: './template.html'
}

const isDev = process.env['NODE_ENV'] === 'dev'
if (isDev) {
  htmlConfig = {
    inject: true,
    template: './template.dev.html'
  }
} else {
  rm('-rf', '../../assets/')
}

module.exports = createConfig([
  entryPoint('./blog.js'),
  setOutput({
    filename: '../../assets/[name].[hash:8].js',
    publicPath: isDev ? undefined : './assets/assets/'
  }),
  babel(),
  less({
    relativeUrls: true
  }),
  // extractText('./build/css/[name].[hash:8].css', 'text/x-less'),
  addPlugins([
    new HtmlWebpackPlugin(htmlConfig),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
    })
  ]),
  postcss([
    autoprefixer({ browsers: ['last 2 versions'] })
  ]),
  defineConstants({
    'process.env.NODE_ENV': process.env.NODE_ENV
  }),
  env('dev', [
    devServer({
      disableHostCheck: true,
      host: '0.0.0.0',
      port: 8080
    }),
    sourceMaps()
  ]),
  env('prod', [
    addPlugins([
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        output: {
          comments: false
        },
        sourceMap: false
      })
    ])
  ])
])
