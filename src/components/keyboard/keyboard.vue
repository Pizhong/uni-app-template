<!--
 * @file: 支付键盘组件
-->
<template>
  <view v-show="showKey" class="c-keyborad">
    <view class="c-keyborad-main" :style="{transform:showKey?'translateY(0)':'translateY(100%)'}">
      <view class="c-keyborad-main_title">
        <image src="./img/del_1.png" mode="aspectFill" @tap="hideFun" />
        <text>请输入支付密码</text>
      </view>
      <view class="c-keyborad-main_content">
        <view class="c-keyborad-main_content_num">
          <view v-for="item in inputArray" :key="item" class="content_item">{{ password[item-1] ? '●' :'' }}</view>
        </view>
        <view class="c-keyborad-main-forget" @tap="forgetFun">忘记密码</view>
      </view>
      <view class="c-keyborad-main-board">
        <view
          v-for="item in numberArray"
          :key="item"
          class="c-keyborad-key_num"
          @tap="inputNumFun({num:item})"
        >
          {{ item }}
        </view>
        <view class="c-keyborad-key_null" />
        <view class="c-keyborad-key_0" @tap="inputNumFun({num:0})">0</view>
        <view class="c-keyborad-key_del" @tap="delNumFun">
          <image src="./img/del_2.png" mode="aspectFill" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    showKey: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputArray: [1, 2, 3, 4, 5, 6], // 输入密码的长度
      numberArray: [1, 2, 3, 4, 5, 6, 7, 8, 9], // 密码键盘的数字
      password: '', // 密码
    }
  },
  computed: {},
  methods: {
    inputNumFun(op) {
      const _this = this
      if (_this.password.length <= 6) {
        _this.password += op.num
        if (_this.password.length === 6) {
          _this.$emit('getPassword', { password: _this.password })
          // uni.showModal({
          //   title: '密码',
          //   content: _this.password,
          //   success() {
          //     _this.password = ''
          //   }
          // })
        }
      }

    },
    delNumFun() {
      if (this.password.length === 0) return
      this.password = this.password.substring(0, this.password.length - 1)
      // console.log('删除后的结果', this.password)
    },
    forgetFun() {
      // uni.showToast({
      //   title: '忘记密码操作',
      //   icon: 'none'
      // })
      this.$emit('forgetFun')
    },
    hideFun() {
      // console.log('close')
      this.$emit('hideFun')
    }
  }
}
</script>

<style lang="scss">
.c-keyborad {
  width:100vw;
  height: 100vh;
  position: fixed;
  bottom: 0px;
  top:0px;
  left:0px;
  right:0px;
  z-index:9999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.6);
  .c-keyborad-main {
    width:100vw;
    height: 850rpx;
    background: #FFFFFF;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transform: translateY(100%);
    transition:all 0.4s;
    .c-keyborad-main_title {
      font-size:36rpx;
      color: #222222;
      height: 130rpx;
      line-height: 42rpx;
      display: flex;
      align-items: center;
      letter-spacing: 2rpx;
      width:100%;
      box-sizing: border-box;
      padding:0px 32rpx;
      image {
        width:48rpx;
        height: 48rpx;
        position: relative;
        z-index:10
      }
      text {
        flex:1;
        margin-left:-48rpx;
        display: flex;
        justify-content: center;
      }
    }
    .c-keyborad-main_content {
      width:100%;
      box-sizing: border-box;
      padding:0px 30rpx;
      .c-keyborad-main_content_num {
        width:100%;
        height: 100rpx;
        border:2rpx solid #DBDBDB;
        border-radius: 10rpx;
        display: flex;
        align-items: center;
        .content_item {
          flex: 1;
          height: 100%;
          border-right: 2rpx solid #DBDBDB;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .content_item:last-child {
          border-right:none
          }
      }
      .c-keyborad-main-forget {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width:100%;
        font-size:28rpx;
        color: #008BEB;
        margin:32rpx 0 50rpx;
        font-family: PingFang SC;
        font-weight: 500;

      }
    }
    .c-keyborad-main-board {
      width:100%;
      height: 500rpx;
      background: #FFFFFF;
      display: flex;
      flex-flow: wrap;
      border-top:2rpx solid #f1f4f4;

      .c-keyborad-key_null,.c-keyborad-key_del {
        background: #f6f6f6;
      }
      image {
        width:55rpx;
        height: 41rpx;
      }
      .c-keyborad-key_num, .c-keyborad-key_null, .c-keyborad-key_del, .c-keyborad-key_0 {
        // width:250rpx;
        width: 33.3%;
        height: 125rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .c-keyborad-key_num {
        border-right:2rpx solid #f1f4f4;
        border-bottom:2rpx solid #f1f4f4;
        box-sizing: border-box;
      }
      .c-keyborad-key_num:nth-child(8) {
        border-bottom: none;
      }
      .c-keyborad-key_0 {
        border-top:2rpx solid #f1f4f4
      }
    }
  }
}
</style>
