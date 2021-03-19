const webpack = require('webpack');
const path = require('path');

const dllPath = 'public/vendor'

module.exports = {
  // 入口文件
  entry: {
    // 项目中用到依赖库文件
    vendor: ['vue', 'vuex', 'vue-router']
  },
  // 输出文件
  output: {
    filename: '[name].dll.js',

    path: path.resolve(__dirname, dllPath),

    /*
      存放相关的dll文件的全局变量名称，比如对于jquery来说的话就是 _dll_jquery, 在前面加 _dll
      是为了防止全局变量冲突。
    */
    library: '_dll_[name]'
  },
  plugins: [
    // 使用插件 DllPlugin
    new webpack.DllPlugin({
      /*
        该插件的name属性值需要和 output.library保存一致，该字段值，也就是输出的 manifest.json文件中name字段的值。
        比如在jquery.manifest文件中有 name: '_dll_jquery'
      */
      name: '_dll_[name]',

      /* 生成manifest文件输出的位置和文件名称 */
      path: path.join(__dirname, dllPath, '[name].manifest.json')
    })
  ]
};
