/* eslint-disable no-useless-escape */
<!--
 * @file: 时间选择组件
-->
<template>
  <view class="c-time-picker">
    <l-popup ref="timePopup" :title="title" @confirm="confirm">
      <view class="c-time-picker-title">
        <text>年</text>
        <text>月</text>
        <text>日</text>
        <text>时</text>
        <text>分</text>
        <text>秒</text>
      </view>
      <view class="c-time-picker-body" @click.stop @touchmove.stop.prevent>
        <picker-view
          :value="valueArr"
          :indicator-style="indicatorStyle"
          class="c-time-picker-view"
          @change="change"
          @pickstart="pickstart"
          @pickend="pickend"
        >
          <picker-view-column v-if="!reset && params.year">
            <view v-for="(item, index) in years" :key="index" class="c-time-picker_item">
              {{ item }}
              <text v-if="showTimeTag">年</text>
            </view>
          </picker-view-column>
          <picker-view-column v-if="!reset && params.month">
            <view v-for="(item, index) in months" :key="index" class="c-time-picker_item">
              {{ formatNumber(item) }}
              <text v-if="showTimeTag">月</text>
            </view>
          </picker-view-column>
          <picker-view-column v-if="!reset && params.day">
            <view v-for="(item, index) in days" :key="index" class="c-time-picker_item">
              {{ formatNumber(item) }}
              <text v-if="showTimeTag">日</text>
            </view>
          </picker-view-column>
          <picker-view-column v-if="!reset && params.hour">
            <view v-for="(item, index) in hours" :key="index" class="c-time-picker_item">
              {{ formatNumber(item) }}
              <text v-if="showTimeTag">时</text>
            </view>
          </picker-view-column>
          <picker-view-column v-if="!reset && params.minute">
            <view v-for="(item, index) in minutes" :key="index" class="c-time-picker_item">
              {{ formatNumber(item) }}
              <text v-if="showTimeTag">分</text>
            </view>
          </picker-view-column>
          <picker-view-column v-if="!reset && params.second">
            <view v-for="(item, index) in seconds" :key="index" class="c-time-picker_item">
              {{ formatNumber(item) }}
              <text v-if="showTimeTag">秒</text>
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </l-popup>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '时间选择'
    },
    // picker中需要显示的参数
    params: {
      type: Object,
      default() {
        return {
          year: true,
          month: true,
          day: true,
          hour: true,
          minute: true,
          second: true,
          timestamp: false,
        }
      }
    },

    // 年月日开始时间
    beginDate: {
      type: [String, Number],
      default: '1990-1-1'
    },

    // 年月日结束时间
    endDate: {
      type: [String, Number],
      default: '2050-12-31'
    },

    // 默认显示的时间，2025-07-02 || 2025-07-02 13:01:00 || 2025/07/02
    defaultTime: {
      type: String,
      default: ''
    },

    // 是否显示后面的年月日中文提示
    showTimeTag: {
      type: Boolean,
      default: false
    },

    // 开始小时
    hourBegin: {
      type: [Number, String],
      default: '0'
    },

    // 结束小时
    hourEnd: {
      type: [Number, String],
      default: '23'
    },

    // 分钟间隔
    minutesInterval: {
      type: [Number, String],
      default: '1'
    },
  },
  data() {
    return {
      years: [],
      months: [],
      days: [],
      hours: [],
      minutes: [],
      seconds: [],
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      reset: false,
      valueArr: [],
      moving: false, // 列是否还在滑动中，微信小程序如果在滑动中就点确定，结果可能不准确
      indicatorStyle: 'height: 96rpx; font-weight: bold; font-size: 28rpx; color: #222222; font-family: PingFang SC;',
    }
  },
  computed: {
    currentYear() {
      return `${this.year}`
    },
    currentMonth() {
      return `${this.month}`
    },
    beginYear() {
      return (new Date(this.beginDate).getFullYear())
    },
    endYear() {
      return (new Date(this.endDate).getFullYear())
    },
    beginMonth() {
      return (new Date(this.beginDate).getMonth() + 1)
    },
    endMonth() {
      return (new Date(this.endDate).getMonth() + 1)
    },
    beginDay() {
      return (new Date(this.beginDate).getDate())
    },
    endDay() {
      return (new Date(this.endDate).getDate())
    },
  },
  watch: {
    currentYear() {
      if (this.params.year) this.setMonths()
    },
    currentMonth() {
      this.setDays()
    },
  },
  mounted() {
    // this.init()
  },
  methods: {
    open() {
      this.init()
      this.$refs.timePopup.open()
    },
    // 日期时间处理
    initTimeValue() {
      // 格式化时间，在IE浏览器(uni不存在此情况)，无法识别日期间的"-"间隔符号
      // eslint-disable-next-line no-useless-escape
      const dfdate = this.defaultTime.replace(/\-/g, '/')
      // eslint-disable-next-line no-useless-escape
      const bdate = this.beginDate.replace(/\-/g, '/')
      // eslint-disable-next-line no-useless-escape
      const edate = this.endDate.replace(/\-/g, '/')
      let time = null
      time = new Date(bdate)
      if (dfdate) {
        time = new Date(dfdate) > new Date(bdate) ? new Date(dfdate) : new Date(bdate)
        time = new Date(dfdate) > new Date(edate) ? new Date(edate) : new Date(dfdate)
      }
      // 获取年日月时分秒
      this.year = time.getFullYear()
      this.month = Number(time.getMonth()) + 1
      this.day = time.getDate()
      this.hour = time.getHours()
      this.minute = time.getMinutes()
      this.second = time.getSeconds()
    },
    // 生成递进的数组
    generateArray: function(start, end) {
      // 转为数值格式，否则用户给end-year等传递字符串值时，下面的end+1会导致字符串拼接，而不是相加
      start = Number(start)
      end = Number(end)
      end = end > start ? end : start
      // 生成数组，获取其中的索引，并剪出来
      return [...Array(end + 1).keys()].slice(start)
    },
    getIndex: function(arr, val) {
      const index = arr.indexOf(val)
      // 如果index为-1(即找不到index值)，~(-1)=-(-1)-1=0 (转成相反数在减一)，导致条件不成立
      return ~index ? index : 0
    },
    init() {
      this.valueArr = []
      this.reset = false
      this.initTimeValue()
      if (this.params.year) {
        this.valueArr.push(0)
        this.setYears()
      }
      if (this.params.month) {
        this.valueArr.push(0)
        this.setMonths()
      }
      if (this.params.day) {
        this.valueArr.push(0)
        this.setDays()
      }
      if (this.params.hour) {
        this.valueArr.push(0)
        this.setHours()
      }
      if (this.params.minute) {
        this.valueArr.push(0)
        this.setMinutes()
      }
      if (this.params.second) {
        this.valueArr.push(0)
        this.setSeconds()
      }
    },
    setYears() {
      // 获取年份集合
      this.years = this.generateArray(this.beginYear, this.endYear)
      // 设置this.valueArr某一项的值，是为了让picker预选中某一个值
      this.valueArr.splice(this.valueArr.length - 1, 1, this.getIndex(this.years, this.year))
    },
    setMonths() {
      // 结束开始年是同年
      if (this.endYear === this.beginYear) {
        this.months = this.generateArray(this.beginMonth, this.endMonth)
      } else if (this.beginYear === this.year) { // 开始年为当前选择年
        this.months = this.generateArray(this.beginMonth, 12)
      } else if (this.endYear === this.year) { // 结束年为当前选择=年
        this.months = this.generateArray(1, this.endMonth)
      } else {
        this.months = this.generateArray(1, 12)
      }
      let index = 0
      if (this.params.year && this.params.month) index = 1
      else index = 0
      this.month = this.months[this.valueArr[index]]
      this.valueArr.splice(index, 1, this.getIndex(this.months, this.month))
    },
    setDays() {
      const totalDays = new Date(this.year, this.month, 0).getDate()
      // 结束开始月份是同月份
      if (this.beginMonth === this.endMonth) {
        this.days = this.generateArray(this.beginDay, this.endDay)
      } else if (this.beginMonth === this.month && this.year === this.beginYear) { // 开始月份为当前选择月
        this.days = this.generateArray(this.beginDay, totalDays)
      } else if (this.endMonth === this.month && this.year === this.endYear) { // 结束月份为当前选择月
        this.days = this.generateArray(1, this.endDay)
      } else { // 正常月份
        this.days = this.generateArray(1, totalDays)
      }

      let index = 0
      // 这里不能使用类似setMonths()中的this.valueArr.splice(this.valueArr.length - 1, xxx)做法
      // 因为this.month和this.year变化时，会触发watch中的this.setDays()，导致this.valueArr.length计算有误
      if (this.params.year && this.params.month) index = 2
      else if (this.params.month) index = 1
      else if (this.params.year) index = 1
      else index = 0
      // 当月份变化时，会导致日期的天数也会变化，如果原来选的天数大于变化后的天数，则重置为变化后的最大值
      // 比如原来选中3月31日，调整为2月后，日期变为最大29，这时如果day值继续为31显然不合理，于是将其置为29(picker-column从1开始)
      if (this.day > this.days.length) this.day = this.days.length
      this.valueArr.splice(index, 1, this.getIndex(this.days, this.day))
    },
    setHours() {
      const bh = +this.hourBegin
      const eh = +this.hourEnd
      this.hours = this.generateArray(bh, eh)
      this.valueArr.splice(this.valueArr.length - 1, 1, this.getIndex(this.hours, this.hour))
    },
    setMinutes() {
      if (+this.minutesInterval > 1) {
        const inter = +this.minutesInterval < 60 ? +this.minutesInterval : 59
        for (let i = 0; i < 60; i += inter) {
          this.minutes.push(i)
        }
      } else {
        this.minutes = this.generateArray(0, 59)
      }
      this.valueArr.splice(this.valueArr.length - 1, 1, this.getIndex(this.minutes, this.minute))
    },
    setSeconds() {
      this.seconds = this.generateArray(0, 59)
      this.valueArr.splice(this.valueArr.length - 1, 1, this.getIndex(this.seconds, this.second))
    },
    backClick() {
      this.backClickClose && this.close()
    },
    // 小于10前面补0，用于月份，日期，时分秒等
    formatNumber(num) {
      return +num < 10 ? '0' + num : String(num)
    },
    // 标识滑动开始，只有微信小程序才有这样的事件
    pickstart() {
      // #ifdef MP-WEIXIN
      this.moving = true
      // #endif
    },
    // 标识滑动结束
    pickend() {
      // #ifdef MP-WEIXIN
      this.moving = false
      // #endif
    },
    // 用户更改picker的列选项
    change(e) {
      console.info('change', e)
      this.valueArr = e.detail.value
      let i = 0
      // 这里使用i++，是因为this.valueArr数组的长度是不确定长度的，它根据this.params的值来配置长度
      // 进入if规则，i会加1，保证了能获取准确的值
      if (this.params.year) this.year = this.years[this.valueArr[i++]]
      if (this.params.month) this.month = this.months[this.valueArr[i++]]
      if (this.params.day) this.day = this.days[this.valueArr[i++]]
      if (this.params.hour) this.hour = this.hours[this.valueArr[i++]]
      if (this.params.minute) this.minute = this.minutes[this.valueArr[i++]]
      if (this.params.second) this.second = this.seconds[this.valueArr[i++]]
    },
    // 用户点击确定按钮
    confirm() {
      // #ifdef MP-WEIXIN
      if (this.moving) return
      // #endif
      const result = {}
      // 只返回用户在this.params中配置了为true的字段
      if (this.params.year) result.year = this.formatNumber(this.year || 0)
      if (this.params.month) result.month = this.formatNumber(this.month || 0)
      if (this.params.day) result.day = this.formatNumber(this.day || 0)
      if (this.params.hour) result.hour = this.formatNumber(this.hour || 0)
      if (this.params.minute) result.minute = this.formatNumber(this.minute || 0)
      if (this.params.second) result.second = this.formatNumber(this.second || 0)
      if (this.params.timestamp) result.timestamp = this.getTimestamp()
      this.$emit('confirm', result)
    },
    // 获取时间戳
    getTimestamp() {
      // yyyy-mm-dd为安卓写法，不支持iOS，需要使用"/"分隔，才能二者兼容
      const time = this.year + '/' + this.month + '/' + this.day + ' ' + this.hour + ':' + this.minute + ':' + this
        .second
      return new Date(time).getTime() / 1000
    }
  }
}
</script>

<style lang="scss" scoped>
.c-time-picker {
 .c-time-picker-title {
    display: flex;
    justify-content: space-around;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #222222;
    line-height: 30rpx;
  }
  .c-time-picker-body {
      width: 100%;
      height: 500rpx;
      overflow: hidden;
      background-color: #fff;
      .c-time-picker-view {
        height: 100%;
        box-sizing: border-box;
        .c-time-picker_item {
          height: 96rpx;
          line-height: 96rpx;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 28rpx;
          font-family: PingFang SC;
          font-weight: 500;
          color: #222222;
        }
      }
  }
}
</style>
