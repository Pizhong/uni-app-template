<!--
 * @file: 树形多选(表单多级联动选择)
-->
<template>
  <view class="l-p-10">
    <view v-for="first in list" :key="first.name">
      <u-checkbox
        :label="first.name"
        :name="first.id"
        :checked="first.checked"
        @change="change($event, first)"
      />
      <view v-for="second in first.children" :key="second.name" class="l-ml-10 l-mt-10">
        <u-checkbox
          :label="second.name"
          :name="second.id"
          :checked="second.checked"
          @change="change($event, second, first)"
        />
        <view v-for="third in second.children" :key="third.name" class="l-ml-20 l-mt-10 l-d-inline-block">
          <u-checkbox
            :label="third.name"
            :name="third.id"
            :checked="third.checked"
            @change="change($event, third, second)"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },

  mounted() {
    this.initTree()
  },

  methods: {
    /** 构造树
     *  给每个子节点设置父亲节点id
     */
    initTree(list) {
      list = list || this.list
      list.forEach(item => {
        if (!item.parent) {
          item.parent = 0
        }
        item.children = item.children || []
        item.children.forEach(child => {
          child.parent = item.id
        })
        this.initTree(item.children)
      })
      return list
    },
    /** 选择节点
     * @rule1 1、选中某子节点，选中父节点
     * @rule2 2、某子节点，取消选择。所有兄弟节点状态相同时，改变父节点状态
     * @rule3 3、选中某一父节点，所有子节点与父节点保持一致
     */
    change(status, item, father) {
      const id = item.id
      let list = this.list
      if (father) {
        list = father.children
      }

      this.checked(id, status)
      // rule3
      this.changeChild(id, status, list)
      this.$emit('change', this.list)
    },
    // 勾选/取消勾选某个id
    checked(id, status = false, list) {
      let same = true
      let parent = -1
      list = list || this.list
      list.forEach(item => {
        if (item.id === id) {
          item.checked = status
          parent = item.parent
          if (status && item.parent) {
            this.checked(item.parent, status)
          }
        }
        if (item.children && item.children.length) {
          this.checked(id, status, item.children)
        }
        if (item.checked) {
          same = false
        }
      })
      // 所有兄弟节点都是取消状态,则取消父亲节点的选中
      if (same && parent !== -1) {
        this.checked(parent, false)
      }
    },
    // 遍历节点并改变所有子节点的状态(全选/取消全选)
    changeChild(id, status, list) {
      list = list || this.list
      list.forEach(item => {
        if (item.id === id) {
          item.checked = status
          this.toggleAllChild(item.children, status)
        }
      })
      return list
    },
    // 切换列表内所有节点的checked状态
    toggleAllChild(list, status) {
      list.forEach(item => {
        item.checked = status
        if (item.children) {
          this.toggleAllChild(item.children, status)
        }
      })
    }
  }
}
</script>

<style>

</style>
