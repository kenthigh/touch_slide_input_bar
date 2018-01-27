module.exports = {
    devtool: 'source-map',
    entry:  __dirname + "/js/main.js",
    output: {
      path: __dirname + "/dist",//打包后的文件存放的地方
      filename: "bundle.js"//打包后输出文件的文件名
    }
  }