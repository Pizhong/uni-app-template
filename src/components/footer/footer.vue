<!--
 * @file: 吸底按钮
-->
<template>
  <view :class="['c-footer', {'c-footer-bordertop': isTopLine}]">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    isTopLine: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style lang="scss" scoped>
.c-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  height: 120rpx;
  background: #FFFFFF;
  padding: 16rpx 32rpx;
}
.c-footer-bordertop {
  border-top: 1px solid #EDEDED;
}
</style>
