<!--
 * @file: 日历组件示例
-->
<template>
  <view>
    <l-calendar v-model="checkDate" @on-selected="onSelected" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      checkDate: new Date(),
    }
  },
  onLoad() {
    console.info(new Date())
  },
  methods: {
    onSelected(value) {
      console.info(value)
    }
  }
}
</script>

<style>

</style>
