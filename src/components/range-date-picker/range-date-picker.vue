<!-- @file 自定义区间（日期选择器） -->
<template>
  <view class="c-date-picker">
    <l-popup
      ref="popup"
      title="时间范围"
      @confirm="confirm"
    >
      <view>
        <view class="c-date-picker-title">
          <view class="c-date-picker-title-item" :class="{ 'c-date-picker-title-active': active === 0 }" @click="changeActive(0)">
            <!-- <view>开始</view> -->
            <view>{{ start.year }}-{{ start.month }}-{{ start.day }}</view>
          </view>
          <view>至</view>
          <view class="c-date-picker-title-item" :class="{ 'c-date-picker-title-active': active === 1 }" @click="changeActive(1)">
            <!-- <view>结束</view> -->
            <view>{{ end.year }}-{{ end.month }}-{{ end.day }}</view>
          </view>
        </view>
        <!-- <view class="c-date-picker-title-active fr" @click="confirm">确定</view> -->
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
    chooceTime: {
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
      active: 0,
      show: false,
      years,
      months,
      days,
      value: [years.length - 1, month - 1, day - 1],
      indicatorStyle: 'height: 50px; font-weight: 400;',
      start: {
        year: '',
        month: '',
        day: ''
      },
      end: {
        year: '',
        month: '',
        day: ''
      },
      noChange: false
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
        if (this.chooceTime && this.chooceTime.start && this.chooceTime.end) {
          // this.start = { ...this.chooceTime.start }
          // this.end = { ...this.chooceTime.end }

          this.start.year = this.chooceTime.start.year
          this.start.month = this.chooceTime.start.month
          this.start.day = this.chooceTime.start.day
          this.end.year = this.chooceTime.end.year
          this.end.month = this.chooceTime.end.month
          this.end.day = this.chooceTime.end.day

          if (this.active === 0) {
            this.year = this.start.year
            this.month = this.start.month
            this.value = [this.years.indexOf(this.start.year), this.months.indexOf(this.start.month), this.days.indexOf(this.start.day)]
            // this.value[0] = this.years.indexOf(this.start.year)
            // this.value[1] = this.months.indexOf(this.start.month)
            // this.value[2] = this.days.indexOf(this.start.day)
          } else {
            this.year = this.end.year
            this.month = this.end.month
            this.value = [this.years.indexOf(this.end.year), this.months.indexOf(this.end.month), this.days.indexOf(this.end.day)]
          }
        } else {
          const year = this.years[this.value[0]]
          const month = this.months[this.value[1]]
          const day = this.days[this.value[2]]
          this.end = {
            year,
            month,
            day
          }
          this.start = {
            year,
            month,
            day
          }
        }
        // console.info(JSON.parse(JSON.stringify(this.days)))
        // console.info(JSON.parse(JSON.stringify(this.value)), 'aaawww')
        setTimeout(() => {
          this.noChange = false
        }, 200)
      }, 200)
    },
    changeActive(e) {
      this.active = e
      if (e === 0) {
        this.value.length = 0
        this.value = [this.years.indexOf(this.start.year), this.months.indexOf(this.start.month), this.days.indexOf(this.start.day)]
      } else {
        this.value = [this.years.indexOf(this.end.year), this.months.indexOf(this.end.month), this.days.indexOf(this.end.day)]
      }
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
      if (this.active === 0) {
        this.start = {
          year,
          month,
          day
        }
      } else if (this.active === 1) {
        this.end = {
          year,
          month,
          day
        }
      }
      this.calcDays()
    },

    confirm() {
      this.active = 0
      this.show = false
      this.$emit('confirm', {
        start: this.start,
        end: this.end
      })
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
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
    font-size: $font-size-text;
    border-bottom: 2rpx solid $border-color-line;
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
  .c-date-picker-title-active {
    color: $color-main;
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
