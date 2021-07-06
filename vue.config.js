const isProduction = process.env.NODE_ENV === 'production'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}
module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/apply': {
        target: process.env.VUE_APP_HOST, //我们的接口域名地址
        // target: 'http://10.0.66.166:8080/beidou-luhe-service', //我们的接口域名地址
        ws: true,
        changeOrigin: true, //允许跨域
        pathRewrite: {
          '^/apply': '/' // 替换target中的请求地址
        }
      }
    }
  },
  css: {
    sourceMap: !isProduction
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
  }
}
