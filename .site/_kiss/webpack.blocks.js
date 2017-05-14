const { addPlugins, createConfig, defineConstants, env, entryPoint, setOutput, sourceMaps, webpack } = require('@webpack-blocks/webpack2')
const babel = require('@webpack-blocks/babel6')
const devServer = require('@webpack-blocks/dev-server2')
const postcss = require('@webpack-blocks/postcss')
const less = function (options) {
    "use strict";
    options = options || {};

    const hasOptions = Object.keys(options).length > 0;

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
    });
}

const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const httpd = require('./httpd')

if (process.env['NODE_ENV'] === 'dev') {
  httpd.run('8778', '../')
}

module.exports = createConfig([
  entryPoint('./src/blog.js'),
  setOutput('./build/[name].[hash:8].js'),
  babel(),
  less(),
  function () {
    return {
      module: {
        loaders: [{
          test: /\.png$/,
          loader: 'file-loader'
        }]
      }
    }
  },
  addPlugins([new HtmlWebpackPlugin({
    inject: true,
    filename: '../../app.html',
    template: './src/template.html'
  })]),
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
