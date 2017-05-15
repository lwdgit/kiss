const { addPlugins, createConfig, defineConstants, env, entryPoint, setOutput, sourceMaps, webpack } = require('@webpack-blocks/webpack2')
const babel = require('@webpack-blocks/babel6')
const extractText = require('@webpack-blocks/extract-text2')
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

const httpd = require('./httpd')
const isDev = process.env['NODE_ENV'] === 'dev'
if (isDev) {
  httpd.run('8778', '../')
} else {
  rm('-rf', './build')
}

module.exports = createConfig([
  entryPoint('./src/blog.js'),
  setOutput({
    filename: './build/[name].[hash:8].js',
    publicPath: '/_kiss/'
  }),
  babel(),
  less({
    relativeUrls: true
  }),
  // extractText('./build/css/[name].[hash:8].css', 'text/x-less'),
  addPlugins([
    new HtmlWebpackPlugin({
      inject: true,
      filename: isDev ? 'index.html' : '../app.html',
      template: './src/template.html'
    }),
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
    devServer(),
    devServer.proxy({
      '/.site/': { target: 'http://localhost:8778/', host: 'localhost' }
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
