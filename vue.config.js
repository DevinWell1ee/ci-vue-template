const path = require('path')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const WebpackBar = require('webpackbar')

const manifest = require('./public/vendor/vendor.manifest.json')


const env = process.env.NODE_ENV
const productionGzipExtensions = /\.(js|css|json|html)(\?.*)?$/i

function resolve(dir) {
  return path.join(__dirname, dir)
}
const target = 'proxy url'

const devProxy = ['/$prefix']

const proxyObj = {}

devProxy.forEach((value) => {
  proxyObj[value] = {
    ws: false,
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${value}`]: value
    }
  }
})

module.exports = {
  /*
  资源链接路径(这个值也可以被设置为空字符串 ('') 或是相对路径 ('./')，
  这样所有的资源都会被链接为相对路径)
   */
  publicPath: '/',

  /**
   * 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。
   */
  outputDir: 'dist',
  /**
   * 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
   */
  indexPath: 'index.html',

  /**
   * 开关资源文件hash
   */
  filenameHashing: true,

  /**
   * 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。
   * 如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
   */
  transpileDependencies: [],

  /**
   * 开关生产环境的source map
   */
  productionSourceMap: false,

  configureWebpack: config => {
    config
      .resolve
      .extensions = ['.js', '.vue', '.json', '.css', '.scss']

    if (['production'].includes(env)) {
      // ! gzip
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      )

      // ! 开启多个子进程
      config.plugins.push(
        new ParallelUglifyPlugin({
          // 传递给 UglifyJS 的参数
          uglifyJS: {
            output: {
              // 最紧凑的输出
              beautify: false,
              // 删除所有的注释
              comments: false,
            },
            compress: {
              // 在UglifyJs删除没有用到的代码时不输出警告
              warnings: false,
              // 删除所有的 `console` 语句，可以兼容ie浏览器
              drop_console: true,
              // 内嵌定义了但是只用到一次的变量
              collapse_vars: true,
              // 提取出出现多次但是没有定义成变量去引用的静态值
              reduce_vars: true,
            }
          }
        })
      )

      // ! 打包后的文件分析插件
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerHost: '127.0.0.1',
          analyzerPort: 8888,
          reportFilename: 'report.html',
          defaultSizes: 'parsed',
          openAnalyzer: true,
          generateStatsFile: false,
          statsFilename: 'stats.json',
          statsOptions: null,
          logLevel: 'info'
        })
      )

      // ! dll plugin
      config.plugins.push(
        new DllReferencePlugin({
          manifest: manifest
        })
      )

      // ! html 注入资源
      config.plugins.push(
        new AddAssetHtmlPlugin({
          filepath: path.resolve(__dirname, './public/vendor/*.js'),
            includeSourcemap: false,
            // dll 引用路径
            publicPath: './vendor',
            // dll最终输出的目录
            outputPath: './vendor'
        })
      )
    } else {
      config.devtool = 'cheap-module-eval-source-map'
    }

    // ! progress
    config.plugins.push(
      new WebpackBar({
        name: `start building：`,
        color: '#f40'
      })
    )
  },

  chainWebpack: config => {
    if (['production'].includes(env)) {
      // ! 图片压缩
      config.module
        .rule("images")
        .use("image-webpack-loader")
        .loader("image-webpack-loader")
        .options({
          bypassOnDebug: true
        })
        .end()
    }

    // ! 别名
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
      .set('utils', resolve('src/utils'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))

    config.plugins.delete('prefetch')

    config.plugins.delete('preload')
  },

  css: {
    extract: ['production'].includes(env),

    sourceMap: false
  },

  devServer: {
    host: '0.0.0.0',
    port: 8080,
    open: true,
    proxy: proxyObj
  }
}
