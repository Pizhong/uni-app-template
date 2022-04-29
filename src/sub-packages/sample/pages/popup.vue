<!--
 * @file: 底部弹窗示例
-->
<template>
  <view>
    <u-button text="click" type="primary" @click="$refs.popup.open()" />
    <l-popup ref="popup" title="标题"> 内容 </l-popup>
  </view>
</template>

<script>
export default {
}
</script>

<style>

</style>
