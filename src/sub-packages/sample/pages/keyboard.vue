<!--
 * @file: 键盘组件示例
-->
<template>
  <view>
    <u-button text="支付键盘" type="primary" @click="showKeyboard" />
    <l-keyboard :show-key="showKey" @hideFun="hideFun" @getPassword="getPassword" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      showKey: false
    }
  },
  methods: {
    showKeyboard() {
      this.showKey = true
    },
    hideFun() {
      this.showKey = false
    },
    getPassword(n) {
      console.info('密码', n)
    }
  }
}
</script>

<style>

</style>
