/*
 * @file: 全局混入
 */
import $store from '../store'

export default {
  computed: {
    // 1-货主 2-船东
    $role() {
      return $store.state.login.loginData.type
    }
  }
}
