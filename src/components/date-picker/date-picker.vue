<!--
 * @file: 日期选择器
-->
<template>
  <view class="c-date-picker">
    <l-popup
      ref="popup"
      title="选择日期"
      @confirm="confirm"
    >
      <view>
        <view class="c-date-picker-title">
          <text>年</text>
          <text>月</text>
          <text>日</text>
        </view>
      </view>

      <view class="c-date-picker-date">
        <picker-view
          :indicator-style="indicatorStyle"
          :value="value"
          class="c-date-picker-view"
          @change="bindChange"
        >
          <picker-view-column>
            <view v-for="(item,index) in years" :key="index" class="c-date-picker-date-item">{{ item }}</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="(item,index) in months" :key="index" class="c-date-picker-date-item">{{ item }}</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="(item,index) in days" :key="index" class="c-date-picker-date-item">{{ item }}</view>
          </picker-view-column>
        </picker-view>
      </view>
    </l-popup>
  </view>
</template>

<script>
export default {
  props: {
    chooceDate: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const date = new Date()
    const years = []
    const months = []
    const month = date.getMonth() + 1
    const days = []
    const day = date.getDate()
    for (let i = 1990; i <= date.getFullYear(); i++) {
      years.push(i)
    }
    for (let i = 1; i <= 12; i++) {
      if (i > 9) {
        months.push(i)
      } else {
        months.push('0' + i)
      }
    }
    for (let i = 1; i <= 31; i++) {
      if (i > 9) {
        days.push(i)
      } else {
        days.push('0' + i)
      }
    }
    return {
      show: false,
      years,
      months,
      days,
      value: [years.length - 1, month - 1, day - 1],
      indicatorStyle: 'height: 50px; font-weight: 400;',
      noChange: false,
      date: {}
    }
  },
  mounted() {
    this.calcDays()
  },
  methods: {
    calcDays() { // 通过选择的年月改变一个月的天数
      const days = []
      switch (this.month) {
        case 2:
          for (let i = 1; i <= 28; i++) {
            if (i > 9) {
              days.push(i)
            } else {
              days.push('0' + i)
            }
          }
          if ((this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0) { // 判断该年份是否为闰年
            days.push(29)
          }
          break
        case 4:
        case 6:
        case 9:
        case 11:
          for (let i = 1; i <= 30; i++) {
            if (i > 9) {
              days.push(i)
            } else {
              days.push('0' + i)
            }
          }
          break
        default:
          for (let i = 1; i <= 31; i++) {
            if (i > 9) {
              days.push(i)
            } else {
              days.push('0' + i)
            }
          }
          break
      }
      this.days = days
      return days
    },
    open() {
      this.show = true
      this.$refs.popup.open()
      setTimeout(() => {
        this.noChange = true
        if (this.chooceDate) {
          this.date.year = this.chooceDate.year
          this.date.month = this.chooceDate.month
          this.date.day = this.chooceDate.day
          this.year = this.date.year
          this.month = this.date.month
          this.value = [this.years.indexOf(this.date.year), this.months.indexOf(this.date.month), this.days.indexOf(this.date.day)]
        } else {
          const year = this.years[this.value[0]]
          const month = this.months[this.value[1]]
          const day = this.days[this.value[2]]
          this.date = {
            year,
            month,
            day
          }
        }
        setTimeout(() => {
          this.noChange = false
        }, 200)
      }, 200)
    },

    bindChange(e) {
      if (this.noChange) {
        return
      }
      const val = e.detail.value
      this.year = this.years[val[0]]
      this.month = this.months[val[1]]
      const year = this.years[val[0]]
      const month = this.months[val[1]]
      const day = this.days[val[2]]
      this.date = {
        year: year,
        month: month,
        day: day
      }
      this.calcDays()
    },

    confirm() {
      this.show = false
      this.$emit('confirm', this.date)
    },
    close() {
      this.$refs.popup.close()
    }
  }
}
</script>

<style lang="scss">
.c-date-picker {
  .c-date-picker-title {
    display: flex;
    justify-content: space-around;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #222222;
    line-height: 30rpx;
  }
  .c-date-picker-title-item {
    display: inline-block;
    // width: 240rpx;
    text-align: center;
    height: 56rpx;
    font-size: 40rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #CCCCCC;
    line-height: 56rpx;
  }
  .c-date-picker-view {
    // height: 600rpx;
    height: 300rpx;
    margin-top: 20rpx;
    font-size: 42rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 58rpx;

  }
  .c-date-picker-date-item {
    line-height: 50px;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
</style>
