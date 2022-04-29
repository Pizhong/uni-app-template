<script>
export default {
  // 全局数据，参考：https://uniapp.dcloud.io/collocation/App?id=globaldata
  globalData: {},
  onLaunch() {
    // #ifdef MP-WEIXIN
    // this.$store.dispatch('wxLogin')
    // #endif

    // 保留登录信息
    if (uni.getStorageSync('loginData')) {
      this.$store.commit('setLoginData', JSON.parse(uni.getStorageSync('loginData')))
    }
    if (uni.getStorageSync('userInfoBase')) {
      this.$store.commit('setUserInfoBase', JSON.parse(uni.getStorageSync('userInfoBase')))
    }
    console.info(uni.getSystemInfoSync())
  },
  methods: {
  },
  onLoad() {
  },
  onShow() {
  },
  onHide() {},
}
</script>

<style lang="scss">
@import '@/assets/styles/atom.scss';
@import '@/assets/styles/common.scss';
@import '@/assets/styles/cover-uview.scss';
/*每个页面公共css */
page,
body {
  font-size: $font-size-subtext;
  font-weight: normal;
  color: $text-color;
  background-color: $background-color;
}

.u-cell__body {
  background: $background-color;
}
</style>
