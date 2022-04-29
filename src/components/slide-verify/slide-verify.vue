<!--
 * @file: 滑动验证
-->
<template>
  <view class="c-slide-verify-Box-Bg">
    <view class="c-slide-verify-Box">
      <view>
        <canvas
          id="c-slide-verify-verify-canvas"
          :style="{ width: canvasW + 'px', height: canvasH + 'px' }"
          canvas-id="c-slide-verify-verify-canvas"
        ></canvas>
      </view>
      <movable-area class="c-slide-verify-Box-BtnBox">
        <view class="c-slide-verify-Box-BtnBox-text">请拖动滑块完成拼图</view>
        <movable-view
          class="c-slide-verify-Box-BtnNei"
          direction="all"
          :x="canvasX2"
          @change="changePath"
          @touchend="endTouch"
        >
          <view class="c-slide-verify-Box-BtnNei-leftBox" :style="{backgroundColor:verifyImgs[verifyIndex].color}" />
        </movable-view>
      </movable-area>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      verifyImgs: [{
        src: '/static/images/0.jpeg',
        color: '#38a7b7'
      }, {
        src: '/static/images/1.jpeg',
        color: '#485967'
      }],
      verifyIndex: 0,
      canvasW: '',
      canvasH: '',
      canvasX2: 0, // 归为用的
      canvasX: 0, // 实时移动X
      ctx: false,
      jgX: 0, // 结果X
      dqImgPath: '', // 本地临时图片路径
    }
  },
  created() {
    this.canvasW = uni.upx2px(686)
    this.canvasH = uni.upx2px(457)
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    // 生成从minNum到maxNum的随机数
    randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10)
          // eslint-disable-next-line no-unreachable
          break
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
          // eslint-disable-next-line no-unreachable
          break
        default:
          return 0
          // eslint-disable-next-line no-unreachable
          break
      }
    },
    init() {
      this.canvasX2--
      this.canvasX = 0
      this.verifyIndex = this.randomNum(0, this.verifyImgs.length - 1)
      this.ctx = uni.createCanvasContext('c-slide-verify-verify-canvas', this)
      this.jgX = this.randomNum(uni.upx2px(150), uni.upx2px(450))
      this.dqImgPath = this.verifyImgs[this.verifyIndex].src
      this.huatu()
    },
    endTouch() {
      if (Math.abs(this.canvasX - this.jgX) <= 5) {
        this.$emit('succeed')
      } else {
        uni.showToast({
          title: '验证失败',
          icon: 'error'
        })
        this.init()
      }
    },
    huatu() {
      const this_ = this
      const r = uni.upx2px(10)
      const XX = this.canvasX
      const YY = uni.upx2px(140)
      const cs = uni.upx2px(20)
      this_.ctx.drawImage(this_.dqImgPath, 0, 0, this_.canvasW, this_.canvasH)

      // 画不可移动的拼图块
      this_.ctx.beginPath()
      this_.ctx.moveTo(-2 * r + this_.jgX + cs + 2 * r, YY - 2 * r + 2 * r)
      this_.ctx.lineTo(-2 * r + this_.jgX + cs + 5.5 * r, YY - 2 * r + 2 * r)
      this_.ctx.arcTo(-2 * r + this_.jgX + cs + 5.5 * r, YY - 2 * r + 3 * r, XX - 2 + this_.jgX * r + cs + 6.5 * r, YY - 2 * r + 3 * r, r)
      this_.ctx.lineTo(-2 * r + this_.jgX + cs + 7.5 * r, YY - 2 * r + 3 * r)
      this_.ctx.arcTo(-2 * r + this_.jgX + cs + 8.5 * r, YY - 2 * r + 3 * r, -2 * r + this_.jgX + cs + 8.5 * r, YY - 2 * r + 2 * r, r)
      this_.ctx.lineTo(-2 * r + this_.jgX + cs + 12 * r, YY - 2 * r + 2 * r)
      this_.ctx.lineTo(-2 * r + this_.jgX + cs + 12 * r, YY - 2 * r + 11 * r)
      this_.ctx.lineTo(-2 * r + this_.jgX + cs + 8.5 * r, YY - 2 * r + 11 * r)
      this_.ctx.arcTo(-2 * r + this_.jgX + cs + 8.5 * r, YY - 2 * r + 12 * r, -2 * r + this_.jgX + cs + 7.5 * r, YY - 2 * r + 12 * r, r)
      this_.ctx.lineTo(-2 * r + this_.jgX + cs + 6.5 * r, YY - 2 * r + 12 * r)
      this_.ctx.arcTo(-2 * r + this_.jgX + cs + 5.5 * r, YY - 2 * r + 12 * r, -2 * r + this_.jgX + cs + 5.5 * r, YY - 2 * r + 11 * r, r)
      this_.ctx.lineTo(-2 * r + this_.jgX + cs + 2 * r, YY - 2 * r + 11 * r)
      this_.ctx.lineTo(-2 * r + this_.jgX + cs + 2 * r, YY - 2 * r + 8 * r)
      this_.ctx.arcTo(-2 * r + this_.jgX + cs + 3 * r, YY - 2 * r + 8 * r, -2 * r + this_.jgX + cs + 3 * r, YY - 2 * r + 7 * r, r)
      this_.ctx.lineTo(-2 * r + this_.jgX + cs + 3 * r, YY - 2 * r + 6 * r)
      this_.ctx.arcTo(-2 * r + this_.jgX + cs + 3 * r, YY - 2 * r + 5 * r, -2 * r + this_.jgX + cs + 2 * r, YY - 2 * r + 5 * r, r)
      this_.ctx.lineTo(-2 * r + this_.jgX + cs + 2 * r, YY - 2 * r + 2 * r)
      this_.ctx.shadowBlur = 10
      this_.ctx.shadowColor = '#ffffff'
      this_.ctx.fillStyle = 'rgba(0,0,0,0.5)'
      this_.ctx.fill()
      this_.ctx.restore()
      // 画可移动的拼图块
      this_.ctx.beginPath()
      this_.ctx.save()
      this_.ctx.moveTo(XX - 2 * r + cs + 2 * r, YY - 2 * r + 2 * r)
      this_.ctx.lineTo(XX - 2 * r + cs + 5.5 * r, YY - 2 * r + 2 * r)
      this_.ctx.arcTo(XX - 2 * r + cs + 5.5 * r, YY - 2 * r + 3 * r, XX - 2 * r + cs + 6.5 * r, YY - 2 * r + 3 * r, r)
      this_.ctx.lineTo(XX - 2 * r + cs + 7.5 * r, YY - 2 * r + 3 * r)
      this_.ctx.arcTo(XX - 2 * r + cs + 8.5 * r, YY - 2 * r + 3 * r, XX - 2 * r + cs + 8.5 * r, YY - 2 * r + 2 * r, r)
      this_.ctx.lineTo(XX - 2 * r + cs + 12 * r, YY - 2 * r + 2 * r)
      this_.ctx.lineTo(XX - 2 * r + cs + 12 * r, YY - 2 * r + 11 * r)
      this_.ctx.lineTo(XX - 2 * r + cs + 8.5 * r, YY - 2 * r + 11 * r)
      this_.ctx.arcTo(XX - 2 * r + cs + 8.5 * r, YY - 2 * r + 12 * r, XX - 2 * r + cs + 7.5 * r, YY - 2 * r + 12 * r, r)
      this_.ctx.lineTo(XX - 2 * r + cs + 6.5 * r, YY - 2 * r + 12 * r)
      this_.ctx.arcTo(XX - 2 * r + cs + 5.5 * r, YY - 2 * r + 12 * r, XX - 2 * r + cs + 5.5 * r, YY - 2 * r + 11 * r, r)
      this_.ctx.lineTo(XX - 2 * r + cs + 2 * r, YY - 2 * r + 11 * r)
      this_.ctx.lineTo(XX - 2 * r + cs + 2 * r, YY - 2 * r + 8 * r)
      this_.ctx.arcTo(XX - 2 * r + cs + 3 * r, YY - 2 * r + 8 * r, XX - 2 * r + cs + 3 * r, YY - 2 * r + 7 * r, r)
      this_.ctx.lineTo(XX - 2 * r + cs + 3 * r, YY - 2 * r + 6 * r)
      this_.ctx.arcTo(XX - 2 * r + cs + 3 * r, YY - 2 * r + 5 * r, XX - 2 * r + cs + 2 * r, YY - 2 * r + 5 * r, r)
      this_.ctx.lineTo(XX - 2 * r + cs + 2 * r, YY - 2 * r + 2 * r)
      this_.ctx.shadowBlur = 10
      this_.ctx.shadowColor = '#ffffff'
      this_.ctx.fill()
      this_.ctx.clip()
      this_.ctx.drawImage(this_.dqImgPath, this_.canvasX - this_.jgX, 0, this_.canvasW, this_.canvasH)
      this_.ctx.restore()
      // 绘图
      this_.ctx.draw()
    },
    changePath(e) {
      this.canvasX = e.target.x
      this.huatu()
    }
  }
}
</script>

<style lang="scss">
.c-slide-verify-Box-Bg{
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  .c-slide-verify-Box{
    background-color: #fff;
    border-radius: 16rpx;
    .c-slide-verify-Box-title{
      height: 100rpx;
      line-height: 1;
      padding: 0 32rpx;
      font-size: 32rpx;
      border-bottom: 1px solid #E1E3E9;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .c-slide-verify-Box-BtnBox{
      margin-top: 38rpx;
      width: 100%;
      height: 101rpx;
      line-height: 101rpx;
      text-align: center;
      font-size: 28rpx;
      border-radius: 6rpx;
      border: 1px solid #E1E3E9;
      background-color: #F7F8F9;
      overflow: hidden;
      position: relative;
      .c-slide-verify-Box-BtnBox-text{
        width: 100%;
        height: 101rpx;
        position: absolute;
        top: 0;
        left: 0;
        color: #424649;
        text-align: center;
      }
      .c-slide-verify-Box-BtnNei{
        height: 101rpx;
        width: 101rpx;
        background-color: #fff;
        box-shadow: 0 0 10rpx 0rpx rgba(0,0,0,.2);
        background-image: url(img/icon-arrows.png);
        background-size: 34rpx;
        background-position: center;
        background-repeat: no-repeat;
        .c-slide-verify-Box-BtnNei-leftBox{
          position: absolute;
          top: 0;
          left: -580rpx;
          width: 580rpx;
          height: 100%;
        }
      }
    }
  }
}
</style>
