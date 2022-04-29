<!--
 * @file: 地址选择组件示例（点击）
-->
<template>
  <view>
    <u-button text="click" type="primary" @click="show = !show" />
    <view class="box">
      <l-chooce-region v-if="show" @chooce="getRegion" />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    }
  },
  methods: {
    // 获得地址
    getRegion(v) {
      console.info(v, 'hhhhh')
    },
  }
}
</script>

<style>
.box {
  width: 500rpx;
  height: 1000rpx;
}
</style>
