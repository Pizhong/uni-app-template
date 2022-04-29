<!--
 * @file: 滑动验证组件示例
-->
<template>
  <view>
    <l-slide-verify @succeed="onSuccess" />
  </view>
</template>

<script>
export default {
  methods: {
    onSuccess() {
      uni.showToast({
        title: '验证成功',
        icon: 'success',
        mask: true
      })
    }
  }
}
</script>

<style>

</style>
