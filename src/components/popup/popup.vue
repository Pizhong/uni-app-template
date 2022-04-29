<!--
 * @file: 底部弹窗
-->
<template>
  <view class="c-popup">
    <u-popup
      :show="show"
      mode="bottom"
      :round="10"
      :closeable="Boolean(title)"
      @close="show = false"
    >
      <view>
        <view v-if="title" class="c-popup-title" :style="{textAlign: textAlign}">
          {{ title }}
        </view>
        <view class="c-popup-body">
          <slot></slot>
        </view>
        <view class="c-popup-footer">
          <view class="c-popup-footer__confirm" @click="confirm">{{ confirmText }}</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  props: {
    // 标题
    title: {
      type: String,
      default: undefined
    },
    // 按钮文字
    confirmText: {
      type: String,
      default: '确定'
    },
    // 标题位置
    textAlign: {
      type: String,
      default: 'start'
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    open() {
      this.show = true
    },
    confirm() {
      this.$emit('confirm')
      this.show = false
    }
  }
}
</script>

<style lang="scss">
.c-popup {
  .c-popup-title {
    font-size: 28rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
    line-height: 30rpx;
    padding: 43rpx 32rpx;
  }
  .c-popup-body {
    padding: 32rpx;
  }
  .c-popup-footer {
    padding: 0 32rpx 58rpx;
    .c-popup-footer__confirm {
      width: 100%;
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 36rpx;
      padding: 28rpx 0;
      text-align: center;
      background: #1890ff;
      border-radius: 16rpx;
    }
  }
}
</style>
