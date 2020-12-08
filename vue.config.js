const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '~table': '@/components/base/BaseTable',
        '~tree': '@/components/base/tree',
        '~dialog': '@/components/base/BaseDialog',
        '~form': '@/components/base/BaseForm',
        '~upload': '@/components/base/BaseUpload',
        '~select': '@/components/base/BaseSelect'
      }
    },
    externals: {
      AMap: 'AMap', // 高德地图配置
      AMapUI: 'AMapUI',
      Loca: 'Loca'
    }
  },
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://120.27.61.185:8002', //
        target: 'http://localhost:8002', //
        ws: true, // websockets
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/dfs': {
        target: 'http://120.27.61.185', //
        ws: true, // websockets
        changeOrigin: true,
        pathRewrite: {
          '^/dfs': ''
        }
      },
      '/auth': {
        target: 'http://123.56.15.69', //
        changeOrigin: true,
        pathRewrite: {
          '^/auth': ''
        }
      }
      // '/cycle': {
      //   target: 'https://tile.thunderforest.com/cycle', //
      //   ws: true, // websockets
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/cycle': ''
      //   }
      // }

    },
    open: true
  }
}
