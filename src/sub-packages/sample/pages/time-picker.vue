<!--
 * @file: 时间选择组件示例
-->
<template>
  <view>
    <u-button text="click" type="primary" @click="$refs.timePicker.open()" />
    <l-time-picker
      ref="timePicker"
      :params="params"
      begin-date="2015-08"
      end-date="2022"
      :default-time="defaultTime"
      @confirm="timeConfirm"
    />
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
    timeConfirm(v) {
      console.info(v)
    }
  }
}
</script>

<style>

</style>
