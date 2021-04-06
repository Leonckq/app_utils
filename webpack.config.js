/***************************************************
 * Created by nanyuantingfeng on 2019/10/29 16:23. *
 ***************************************************/
const config = require('whispered-build/webpack.simple.dev.config')

config.devtool('source-map')

config.patch.entry({
  index: './example/index.tsx'
})

config.devServer.port(9933).proxy([
  {
    context: ['/debug', '/api', '/static'],
    target: 'http://demo.com',
    changeOrigin: true
  }
])

module.exports = config.toConfig()
