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
        {
          test: /\.pug$/,
          loader: 'pug-loader'
        },
        {
          test: /\.styl$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'stylus-loader']
          })
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          }
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader?name=imgs/[name].[ext]',
          options: {
            name: 'img/[name].[ext]'
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: 'body',
        template: 'page/home.pug',
        filename: 'home.html',
      }),
      new HtmlWebpackPlugin({
        inject: 'body',
        template: 'page/study.pug',
        filename: 'study.html',
      }),
      new ExtractTextPlugin("[name].css"),
    ]
  }