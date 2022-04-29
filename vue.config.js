// vue.config.js
console.info(process.env.VUE_APP_DOMAIN, '=========================App')
module.exports = {
  transpileDependencies: ['uview-ui'],
  devServer: {
    proxy: {
      '/lgh': {
        target: 'http://110.43.33.154/',
        changeOrigin: true
      }
    }
  },
}
