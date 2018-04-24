const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const glob = require('globby')
const path = require('path')
const webpack = require('webpack'); 
var entryMap = {}

var fileList = glob.sync(['./js/*.js'])
for(var i = 0; i < fileList.length; i++) {
  entryMap[path.basename(fileList[i]).split('.')[0]] = fileList[i]
}

module.exports = {
    devtool: 'source-map',
    entry:  entryMap,
    output: {
      path: __dirname + "/dist",
      filename: "[name].js" //打包后输出文件的文件名
    },
    module: {
      rules: [
        { test: /\.pug$/, loader: 'pug-loader' },
        { test: /\.styl$/, loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'stylus-loader'] 
        })},
        { test: /\.png$/, loader: 'file-loader'}
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: 'page/demo.pug', 
        filename: 'm.html',     
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: 'page/vertical.pug',
        filename: 'v.html'
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: 'page/weight.pug',
        filename: 'weight.html'
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: 'page/tanghua.pug',
        filename: 'tanghua.html'
      }),
      new ExtractTextPlugin("[name].css"),
      // new webpack.optimize.UglifyJsPlugin()
    ]
  }