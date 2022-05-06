<!--
 * @file: 地址选择组件示例（点击）
-->
<template>
  <view>
    <u-button text="click" type="primary" @click="show = !show" />
    <view class="box">
      <l-chooce-region
        v-if="show"
        :current-pro-index.sync="currentProIndex"
        :current-city-index.sync="currentCityIndex"
        @chooce="getRegion"
      />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      currentProIndex: 0,
      currentCityIndex: 0
    }
  },
  methods: {
    // 获得地址
    getRegion(v) {
      uni.showToast({ title: `${v.province.name}${v.city.name}`, icon: 'none' })
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
