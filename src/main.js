import Vue from 'vue'
import App from './App'
import store from './store'
import utils from '@/utils/utils'
import auth from '@/utils/auth'
import mixin from '@/utils/mixin'
import filter from '@/utils/filter'
import { mockInit } from '../mock/index'

import uView from 'uview-ui'
Vue.use(uView)
uni.$u.config.unit = 'px'

App.mpType = 'app'

console.info(process.env.VUE_APP_DOMAIN, '============================')

// 获取地区列表
if(!uni.getStorageSync('areaList')) {
 store.dispatch('getAreaList')
}
// 初始化权限控制
Vue.mixin(auth)
Vue.mixin(mixin)
// 初始化过滤器
filter.init(Vue)
// 初始化mock
if (process.env.VUE_APP_MOCK === '1') {
  mockInit()
}
Vue.use({
  install(Vue) {
    Vue.prototype.$utils = utils

    // 页面跳转 (type)
    /**
     * @description: 页面跳转
     * @param {Object} data 页面跳转参数 {url: '', data: {}}
     * @param {String} type 跳转类型, 默认跳转页面(navigate) 可选值:
     * 1、navigate跳转页面
     * 2、redirect关闭当前页并跳转页面
     * 3、reLaunch关闭所有页面，打开到应用内的某个页面
     * 4、switchTab跳转到tabBar页面
     * @return {*}
     */
    Vue.prototype.navigate = (data, type) => {
      let params = ''
      if (data.data) {
        params = utils.getParamsStr(data.data)
      }
      if (params) {
        if (data.url.indexOf('?') === -1) {
          data.url = data.url + '?' + params
        } else {
          data.url = data.url + '&' + params
        }
      }
      if (type === 'redirect') {
        utils.debounce(uni.redirectTo(data), 1000)
      } else if (type === 'reLaunch') {
        utils.debounce(uni.reLaunch(data), 1000)
      } else if (type === 'switchTab') {
        utils.debounce(uni.switchTab(data), 1000)
      } else {
        utils.debounce(uni.navigateTo(data), 1000)
      }
    }

    // 页面返回
    Vue.prototype.navigateBack = (data = {}) => {
      // #ifdef H5
      const delta = -(data.delta || 1)
      utils.debounce(history.back(delta), 1000)
      // #endif
      // #ifndef H5
      utils.debounce(uni.navigateBack(data), 1000)
      // #endif
    }
  }
})

const app = new Vue({
  ...App,
  store: store,
})
app.$mount()
