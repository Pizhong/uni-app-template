<!--
 * @file: 树形组件示例
-->
<template>
  <view>
    <l-tree
      v-model="id"
      :list="list"
      :enable-choose="true"
      :is-edit="true"
      :is-icon="false"
      @edit="edit"
      @click="itemClick"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: [1],
      list: [
        {
          id: 1,
          name: '肉类',
          value: '新鲜, 澳大利亚进口',
          children: [
            {
              id: 11,
              name: '生鲜',
              value: '新鲜, 澳大利亚进口',
              children: [{
                id: 111,
                name: '鱼类',
                children: [{
                  id: 1111,
                  name: '双目鱼类',
                  children: [{
                    id: 11111,
                    name: '比目鱼'
                  }]
                }]
              }]
            },
            {
              id: 112,
              name: '哺乳类',
              children: [{
                id: 1112,
                name: '多毛生物',
                children: [{
                  id: 11112,
                  name: '山羊',
                  children: [{
                    id: 111112,
                    name: '黑山羊'
                  }]
                }]
              }]
            },
          ]
        },
        {
          id: 2,
          name: '蔬菜',
          children: [
            {
              id: 21,
              name: '白菜',
            },
            {
              id: 22,
              name: '胡萝卜',
            },
            {
              id: 23,
              name: '土豆',
            },
          ]
        }
      ],
    }
  },
  methods: {
    edit(item) {
      console.info(item)
    },
    itemClick(e) {
      console.info(e)
      console.info(this.id)
    }
  }
}
</script>
