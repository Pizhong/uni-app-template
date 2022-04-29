<!--
 * @file: 树形数据
-->
<template>
  <view>
    <u-checkbox-group v-model="checked">
      <view class="c-tree-list" :class="[isIcon?'c-tree-list--large':'']">
        <view v-for="(item, index) in listData" :key="index" class="l-d-flex">
          <view v-show="item.show && enableChoose" class="c-tree-checkbox">
            <u-checkbox shape="circle" :name="item.id" @change="chooseTreeItem(item)" />
          </view>
          <view
            class="tree-item"
            :class="{show: item.show}"
            :style="{paddingLeft: item.level * 30 + 24 + 'rpx'}"
            @click.stop="chooseTreeItem(item, index)"
          >
            <view class="tree-item-content">
              <image
                v-if="isIcon"
                :src="item.icon || defaultIcon"
                class="c-tree-icon-left"
              />
              <image
                v-if="(!item.isLast && isArrow) || (isAsync && item.level < 2)"
                :src="arrowIcon"
                class="c-tree-icon"
                :class="[item.showChild?'c-tree-icon--active':'']"
                @click.stop="switchChild(item, index)"
              />
              <text class="c-tree-text">{{ item.name }}</text>
            </view>
            <view>
              <text class="c-tree-value">{{ item.value }}</text>
              <image
                v-if="isEdit"
                src="./images/edit-active.png"
                class="c-tree-edit"
                @click.stop="edit(item)"
              />
            </view>
          </view>
        </view>
      </view>
    </u-checkbox-group>
  </view>
</template>

<script>
export default {
  props: {
    /** 树形数据,格式:
     *  [{
     *    id: 1,
     *    name: '肉类',
     *    icon: '',
     *    value: '右侧内容'
     *    children: []
     *  }]
     *  */
    list: {
      type: Array,
      default: () => { return [] }
    },
    // 当前选中的id
    value: {
      type: [String, Array, Number],
      default: () => []
    },
    keepLevel: { // 是否保存折叠信息
      type: Boolean,
      default: true
    },
    // 箭头图片
    arrowIcon: {
      type: String,
      default: './images/down.png'
    },
    // 是否显示左侧箭头
    isArrow: {
      type: Boolean,
      default: true
    },
    // 是否需要显示icon
    isIcon: {
      type: Boolean,
      default: false
    },
    // 展开路径
    unfoldPath: {
      type: Array,
      default() { return [] }
    },
    // 是否全部折叠 0:折叠 1：展开
    isAllfold: {
      type: Number,
      default: 0
    },
    // 是否包含选择
    enableChoose: {
      type: Boolean,
      default: false
    },
    // 是否只能选择最后一级
    // finalChoose: {
    //   type: Boolean,
    //   default: false
    // },
    // 是否单选
    singleSelect: {
      type: Boolean,
      default: false
    },
    // 是否显示编辑按钮
    isEdit: {
      type: Boolean,
      default: false
    },
    // 是否异步（动态）渲染(先渲染省, 动态渲染市、区)
    isAsync: {
      type: Boolean,
      default: false
    },
    // 是否在点击行的时候也展开/收起行
    clickRowFold: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      listData: [],
      checked: [],
      defaultIcon: './images/department.png',
      tempList: [] // 缓存数据,用于缓存数据更新前列表的展开状态, 数据更新后恢复状态
    }
  },
  watch: {
    list(list) {
      this.tempList = JSON.parse(JSON.stringify(this.listData)) || []
      this.listData = []
      this.updateListData(list)
      if (!this.isAsync) {
        this.switchFold()
      }
    },
    value(selected) {
      this.changeSelected(selected)
    },
    unfoldPath() {
      this.unfold()
    },
    isAllUnfold() {
      this.switchFold()
    }
  },
  mounted() {
    this.checked = this.value
    if (this.list) {
      this.listData = []
      this.updateListData(this.list)
    }

    if (this.unfoldPath) {
      this.unfold()
    }
    this.switchFold()
  },
  methods: {
    edit(item) {
      this.$emit('edit', item)
    },
    updateListData(list = [], level = 0, parentId = []) { // 转换prop的list数据结构为单层数组形式
      let selected = []
      if (typeof (this.value) === 'number') {
        selected[0] = this.value
      } else {
        selected = this.value
      }
      list.forEach(item => {
        let show = level === 0
        if (this.isAsync) {
          show = true
        }
        let isParentShow = false
        let showChild = false
        this.tempList.forEach(i => {
          if (item.id === i.id) {
            show = i.show
            isParentShow = i.isParentShow
            showChild = i.showChild
          }
        })
        this.listData.push({
          id: item.id,
          name: item.name,
          value: item.value,
          parentId, // 父级id数组
          level, // 层级
          isLast: false, // 是否是最后一级
          show: show, // 是否显示自己
          isParentShow: isParentShow, // 直接的父级是否显示
          showChild: showChild, // 是否显示子级
          isSelected: item.isSelected ? item.isSelected : !!(false || selected.includes(item.id)), // 是否是挑选中的
          item: item
        })
        if (Array.isArray(item.children) && item.children.length > 0) {
          const parents = [...parentId]
          parents.push(item.id)
          this.updateListData(item.children, level + 1, parents)
        } else {
          this.listData[this.listData.length - 1].isLast = true
        }
      })
    },
    unfold() { // 展开路径
      this.unfoldPath.forEach(item => { // 标记所有的父级设置showChild属性为true
        this.listData.forEach(iitem => {
          if (iitem.id === item) {
            iitem.showChild = true
          }
        })
      })
      this.unfoldPath.forEach(id => { // 显示子级
        this.listData.forEach(iitem => {
          if (iitem.parentId.includes(id)) {
            if (iitem.parentId[iitem.parentId.length - 1] === id) {
              iitem.isParentShow = true
            }
            if (iitem.isParentShow === true) { // 如果他的直接父级是在显示的并且父级的祖先也都是显示
              let isShow = true
              iitem.parentId.forEach(parent => {
                this.listData.forEach(listItem => {
                  if (listItem.id === parent) {
                    if (listItem.showChild === false) {
                      isShow = false
                    }
                  }
                })
              })
              if (isShow) {
                iitem.show = true
              }
            }
          }
        })
      })
    },
    unfoldAll() { // 展开全部
      this.listData.forEach(item => {
        if (item.level !== 0) {
          item.isParentShow = true
        }
        if (!item.isLast) {
          item.showChild = true
        }
        item.show = true
      })
    },
    foldAll() { // 折叠全部
      this.listData.forEach(item => {
        item.show = false
        if (item.level === 0) {
          item.show = true
        }
        item.showChild = false
        item.isParentShow = false
      })
    },
    switchFold() {
      if (this.isAllfold === 0) this.foldAll()
      if (this.isAllfold === 1) this.unfoldAll()
    },
    switchChild(item, index) {
      this.$emit('switchChild', item, index)
      if (this.keepLevel) {
        this.switchChild1(item, index)
      } else {
        this.switchChild2(item, index)
      }
    },
    changeSelected(selected) { // 更新选中状态
      this.checked = selected
      const list = this.listData

      list.forEach(item => {
        item.isSelected = false
        if (selected.includes(item.id)) {
          item.isSelected = true
        }
      })
    },
    switchChild2(item) { // 切换子级显示不保留折叠信息
      const list = this.listData
      const id = item.id
      item.showChild = !item.showChild
      list.forEach(iitem => {
        if (item.showChild === false) {
          if (!iitem.parentId.includes(id)) { // 隐藏所有子级
            return
          }
          if (iitem.isLast !== true) {
            iitem.showChild = false
          }
          iitem.show = false
        } else {
          if (iitem.parentId[iitem.parentId.length - 1] === id) {
            iitem.show = true
          }
        }
      })
    },
    switchChild1(item) { // 切换子级显示保存折叠信息
      const list = this.listData
      const id = item.id
      const showPath = []

      item.showChild = !item.showChild

      list.forEach(iitem => {
        if (item.showChild === false) {
          if (!iitem.parentId.includes(id)) {
            return
          }
          if (iitem.parentId[iitem.parentId.length - 1] === id) {
            iitem.isParentShow = false
          }
          iitem.show = false
        } else {
          if (iitem.parentId.includes(id)) {
            if (iitem.parentId[iitem.parentId.length - 1] === id) {
              iitem.isParentShow = true
              iitem.show = true
            }
            if (iitem.isParentShow === true) { // 如果他的直接父级是在显示的并且父级的祖先也都是显示
              let isShow = true
              iitem.parentId.forEach(parent => {
                this.listData.forEach(listItem => {
                  if (listItem.id === parent) {
                    if (listItem.showChild === false) {
                      isShow = false
                    }
                  }
                })
              })
              if (isShow) {
                iitem.show = true
              }
            }
          }
        }
      })

      // 生成展示路径
      this.listData.forEach(item => {
        if (item.showChild) {
          showPath.push(item.id)
        }
      })
    },
    // 点击行
    chooseTreeItem(item, index) {
      if (this.clickRowFold) {
        this.switchChild(item, index)
      }
      const value = this.value
      if (this.enableChoose) {
        const id = item.id
        let isHas = false
        if (this.finalChoose) { // 是否只能选择最后一个
          if (item.isLast === true) {
            if (value.includes(item.id)) {
              value.splice(value.indexOf(item.id), 1)
            } else {
              if (this.singleSelect) { // 是否单选
                value.pop()
              }
              value.push(item.id)
            }
            this.$emit('input', value)
            this.$emit('change', value)
            this.$emit('click', item)
          }
        } else {
          for (let i = 0; i < value.length; i++) {
            if (value[i] === id) {
              isHas = true
              value.splice(i, 1)
            }
          }
          if (!isHas) {
            if (this.singleSelect) { // 是否单选
              value.pop()
            }
            value.push(id)
          }
          // const data = { item, selected: value }
          this.$emit('input', value)
          this.$emit('change', value)
          this.$emit('click', item)
        }
      } else {
        this.$emit('click', item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.c-tree-list {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  width: 100%;
  /* #ifndef MP */
  .tree-item {
    height: 0;
    opacity: 0;
    transition: 0.2s;
    display: none;
  } /*小程序这里加display: none*/
  .tree-item.show {
    height: 40rpx;
    line-height: 40rpx;
    opacity: 1;
    display: flex;
    border-bottom: 1rpx solid $border-color-line;
  } /*小程序这里加display: block*/
  /* #endif */
  /* #ifdef MP */
  .tree-item {
    height: 0;
    opacity: 0;
    transition: 0.2s;
    display: none;
  }
  .tree-item.show {
    height: 40rpx;
    line-height: 40rpx;
    opacity: 1;
    display: flex;
    border-bottom: 1rpx solid $border-color-line;
  }
  /* #endif */
  .swipe-item .tree-item {
    width: 100%;
  }
  .tree-item {
    flex: 1;
    height: 0;
    opacity: 0;
    transition: 0.2s;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30rpx;
    color: $text-color-nomal;
    background-color: #ffffff;
    overflow: hidden;
  }
  .tree-item image.choose {
    width: 60rpx;
    height: 60rpx;
  }
  .tree-item.show {
    height: 42rpx;
    opacity: 1;
    padding: 28rpx 24rpx;
  }
  .tree-item .c-tree-icon {
    width: 32rpx;
    height: 32rpx;
    margin: 8rpx;
    transform: rotate(-90deg);
    transition: 0.2s;
    &.c-tree-icon--active {
      transform: rotate(0);
    }
  }
  .c-tree-icon-left {
    width: 80rpx;
    height: 80rpx;
    margin-right: 20rpx;
    border-radius: 6rpx;
  }
  .tree-item .c-tree-text {
    padding-left: 0rpx;
  }
  &.c-tree-list--large {
    .tree-item.show {
      padding-top: 50rpx;
      padding-bottom: 50rpx;
    }
  }
  .c-tree-value {
    color: $text-color;
    max-width: 40%;
  }
  .c-tree-edit {
    width: 32rpx;
    height: 32rpx;
    padding: 4rpx 0 4rpx 16rpx;
    vertical-align: top;
  }
}
.tree-item-content {
  display: flex;
  align-items: center;
}
</style>
