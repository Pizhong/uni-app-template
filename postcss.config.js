const path = require('path')

const DESIGN_WIDTH = 750

const CONVERT_RATIO = {
  '750': 0.5,
  '350': 2 / 1,
}

const COMMON_CONFIG = {
  selectorBlackList: ['.ignore'],
  minPixelValue: 0.01,
  unitPrecision: 5,
  mediaQuery: false
}

const CONVERT_CONFIG = {
  h5: {
    viewportWidth: CONVERT_RATIO[DESIGN_WIDTH] * 100 * 100,
    viewportUnit: 'rem',
    fontViewportUnit: 'rem',
    ...COMMON_CONFIG
  },
  'app-plus': {
    viewportWidth: CONVERT_RATIO[DESIGN_WIDTH] * 100 * 100 / 3,
    viewportUnit: 'rem',
    fontViewportUnit: 'rem',
    ...COMMON_CONFIG
  },
  'mp-weixin': {
    viewportWidth: CONVERT_RATIO[DESIGN_WIDTH] * 100,
    viewportUnit: 'rpx',
    fontViewportUnit: 'rpx',
    ...COMMON_CONFIG
  }
}

// [官方文档](https://www.npmjs.com/package/postcss-px-to-viewport)
module.exports = {
  parser: require('postcss-comment'),
  plugins: [
    require('postcss-import')({
      resolve(id, basedir, importOptions) {
        if (id.startsWith('~@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3))
        } else if (id.startsWith('@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2))
        } else if (id.startsWith('/') && !id.startsWith('//')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1))
        }
        return id
      }
    }),
    require('autoprefixer')({
      remove: process.env.UNI_PLATFORM !== 'h5'
    }),
    require('@dcloudio/vue-cli-plugin-uni/packages/postcss'),
    require('postcss-px-to-viewport')(CONVERT_CONFIG[process.env.UNI_PLATFORM] || CONVERT_CONFIG.h5)
  ]
}
