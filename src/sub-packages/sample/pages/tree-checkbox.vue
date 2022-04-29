<!--
 * @file:联动多选框
-->
<template>
  <view>
    <l-tree-checkbox :list="list" @change="change" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [{
        id: 1,
        name: '权限管理',
        checked: false,
        children: [{
          id: 11,
          name: '运维权限',
          checked: false,
          children: [{
            id: 111,
            name: '查看',
            checked: false,
            children: []
          }, {
            id: 112,
            name: '编辑/新增',
            checked: false,
            children: []
          }, {
            id: 113,
            name: '删除',
            checked: false,
            children: []
          }]
        }, {
          id: 12,
          name: '统计数据',
          checked: false,
          children: [{
            id: 121,
            name: '查看',
            checked: false,
            children: []
          }, {
            id: 122,
            name: '删除',
            checked: false,
            children: []
          }]
        }]
      }]
    }
  },
  methods: {
    change(list) {
      console.info(list)
      this.list = list
    }
  }
}
</script>
