<!--
 * @file: 地址选择组件示例
-->
<template>
  <view>
    <u-button text="click" type="primary" @click="$refs.regionPicker.open()" />
    <l-region-picker ref="regionPicker" title="选择所在地" @confirm="confirm" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      defaultTime: '2021-06-25 17:12:00',
      params: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        second: true,
        timestamp: false,
      }
    }
  },
  methods: {
    // 确认收票人所在地
    confirm(v) {
      console.info(v, 'hhhhh')
    },
  }
}
</script>

<style>

</style>
