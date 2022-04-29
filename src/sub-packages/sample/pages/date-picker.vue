<!--
 * @file: 日期选择器示例
-->
<template>
  <view>
    <u-button text="click" type="primary" @click="$refs.datePicker.open()" />
    <l-date-picker ref="datePicker" :chooce-date="chooceDate" @confirm="handleConfirm" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      chooceDate: {
        year: 2022,
        month: 1,
        day: 23
      },
    }
  },
  methods: {
    handleConfirm(v) {
      console.info(v)
    }
  }
}
</script>

<style>

</style>
