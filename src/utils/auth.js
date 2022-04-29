/*
 * @file: 权限控制
 * 由于uni-app小程序端不支持自定义指令。所以使用mixin的方式来实现权限控制。
 * 使用方法：在需要控制的按钮加入 v-if="auth('权限')"
 * 例如: 需要权限 button 才能显示的按钮则在按钮的样式中加入 v-if="auth('button')"
 */
import $store from '../store'

export default {
  methods: {
    auth(type) {
      if ($store.state.common.auth) {
        if ($store.state.common.auth.indexOf(type) !== -1) {
          return true
        }
      }
      return false
    }
  }
}
