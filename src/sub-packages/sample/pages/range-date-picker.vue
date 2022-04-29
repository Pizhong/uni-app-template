<!--
 * @file: 日期区间选择器示例
-->
<template>
  <view>
    <u-button text="click" type="primary" @click="$refs.rangeDatePicker.open()" />
    <l-range-date-picker ref="rangeDatePicker" @confirm="confirm" />
  </view>
</template>

<script>
export default {
  methods: {
    confirm(v) {
      console.info(v)
    }
  }
}
</script>

<style>

</style>
