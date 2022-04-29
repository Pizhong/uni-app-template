<!-- @file: 悬浮组件-->
<template>
  <view class="c-fab" :style="{right: right, bottom: bottom, background: background}" @click="tap">
    <image class="c-fab__image" :src="icon" />
    <text class="c-fab__text">{{ text }}</text>
  </view>
</template>
<script>
export default {
  props: {
    // 图标
    icon: {
      type: String,
      default: '/static/images/icon-ship.png'
    },
    // 文字
    text: {
      type: String,
      default: '认证船舶'
    },
    // 位置
    right: {
      type: String,
      default: '33rpx'
    },
    // 位置
    bottom: {
      type: String,
      default: '400rpx'
    },
    // 背景
    background: {
      type: String,
      default: '#F0F0F0'
    }
  },
  emits: ['click'],
  methods: {
    tap() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
  @mixin flex($direction: row) {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: $direction;
  }

  .c-fab {
    @include flex(column);
    justify-content: center;
    align-items: center;
    width: 144rpx;
    height: 144rpx;
    background: #F0F0F0;
    border-radius: 50%;
    position: fixed;
    right: 33rpx;
    bottom: 400rpx;

    .c-fab__image {
      width: 56rpx;
      height: 56rpx;
    }

    .c-fab__text {
      font-size: 24rpx;
      color: #666666;
      line-height: 30rpx;
      margin: 12rpx;
    }
  }
</style>
