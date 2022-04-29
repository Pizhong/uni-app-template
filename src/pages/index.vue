<!--
 * @file: 示例首页
-->
<template>
  <view>
    <u-cell-group>
      <u-cell
        v-for="(item, index) in componetsList"
        :key="index"
        is-link
        :title="item.title"
        @click="goPage(item.url)"
      />
    </u-cell-group>
  </view>
</template>

<script>
export default {
  data() {
    return {
      componetsList: [
        {
          title: '滑动验证',
          url: '/sub-packages/sample/pages/slide-verify'
        },
        {
          title: '悬浮组件',
          url: '/sub-packages/sample/pages/fab'
        },
        {
          title: '支付键盘',
          url: '/sub-packages/sample/pages/keyboard'
        },
        {
          title: '底部弹窗',
          url: '/sub-packages/sample/pages/popup'
        },
        {
          title: '日历组件',
          url: '/sub-packages/sample/pages/calendar'
        },
        {
          title: '吸底组件',
          url: '/sub-packages/sample/pages/footer'
        },
        {
          title: '日期选择组件',
          url: '/sub-packages/sample/pages/date-picker'
        },
        {
          title: '时间选择组件',
          url: '/sub-packages/sample/pages/time-picker'
        },
        {
          title: '地址选择组件',
          url: '/sub-packages/sample/pages/region-picker'
        },
        {
          title: '地址选择组件(点击)',
          url: '/sub-packages/sample/pages/chooce-region'
        },
        {
          title: '日期区间选择器',
          url: '/sub-packages/sample/pages/range-date-picker'
        },
        {
          title: '树形组件示例',
          url: '/sub-packages/sample/pages/tree'
        },
        {
          title: '联动选择框示例',
          url: '/sub-packages/sample/pages/tree-checkbox'
        }
      ]
    }
  },
  methods: {
    goPage(url) {
      this.navigate({
        url: url
      })
    }
  }
}
</script>

<style>

</style>
