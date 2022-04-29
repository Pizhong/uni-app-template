<!-- @file: 推荐货源/最新货源卡片组件-->
<template>
  <view class="c-goods-source">
    <view class="c-goods-source-goodsNo">
      <view class="c-goods-source-goodsNo-left">
        <img src="static/images/index/icon-goods-no.png" />
        <text class="c-goods-source-goodsNo-text">货号：{{ data.goodsNO }}</text>
      </view>
      <view class="c-goods-source-status" :style="{'color': status === '发布中' ? '#008BEB':'#999999'}">
        <slot name="status"></slot>
      </view>
    </view>
    <view class="c-goods-source-tag">
      <view class="tag-item">{{ data.goodsName }}</view>
      <view class="tag-item">{{ data.goodsQuantity }}</view>
      <view v-if="data.chargeMode === 2" class="tag-item">包船{{ data.money }}元</view>
      <view v-if="data.chargeMode === 1" class="tag-item">单价{{ data.money }}元</view>
      <view class="tag-item">{{ data.time }}</view>
    </view>
    <view class="c-goods-source-diviver" />
    <view class="c-goods-source-place" style="margin-bottom: 24rpx">
      <img src="static/images/index/icon-zhuang.png" />
      <view class="c-goods-source-text">{{ data.loadPlace }}</view>
    </view>
    <view class="c-goods-source-place">
      <img src="static/images/index/icon-xie.png" />
      <view class="c-goods-source-text">{{ data.unloadPlace }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
      require: true
    },
    status: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.c-goods-source {
  // width: 635rpx;
  // box-sizing: border-box;
  padding: 40rpx 24rpx;
  background: #FFFFFF;
  border: 1rpx solid #EDEDED;
  border-radius: 16rpx;
  .c-goods-source-goodsNo {
    height: 33rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    .c-goods-source-goodsNo-left {
      display: flex;
      align-content: center;
      img {
        width: 32rpx;
        height: 33rpx;
        margin-right: 17rpx;
      }
      .c-goods-source-goodsNo-text {
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: #222222;
      }
    }
    .c-goods-source-status {
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: 500;
    }
  }
  .c-goods-source-tag {
    display: flex;
    .tag-item {
      border: 1rpx solid #1890ff;
      border-radius: 4rpx;
      padding: 7rpx 14rpx;
      margin-right: 16rpx;
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #1890ff;
    }
  }
  .c-goods-source-diviver {
    margin: 30rpx 0;
    width: 100%;
    height: 1rpx;
    background: #EDEDED;
  }
  .c-goods-source-place {
    display: flex;
    align-items: center;
    img {
      width: 32rpx;
      height: 32rpx;
      margin-right: 16rpx;
    }
    .c-goods-source-text {
      font-size: 28rpx;
      font-weight: bold;
      color: #222222;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
