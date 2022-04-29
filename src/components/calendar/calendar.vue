<!--
 * @file: 日历组件---暂时只兼容H5,app
-->

<template>
  <view class="z-calendar">
    <picker-view
      :indicator-style="indicatorStyle"
      :value="dateValue"
      class="picker-view"
      @change="bindChange"
    >
      <picker-view-column>
        <view v-for="(item,index) in years" :key="index" class="item">{{ item }}年</view>
      </picker-view-column>
      <picker-view-column>
        <view v-for="(item,index) in months" :key="index" class="item">{{ item }}月</view>
      </picker-view-column>
    </picker-view>
    <view class="z-calenda-wrap">
      <view class="z-calendar-dates">
        <view
          v-for="(date,index) in daysMap"
          :key="index"
          class="z-calendar-date"
        >
          <view
            class="z-calendar-date-inner"
            :class="{
              ishighlight: date.isHighlight,
            }"
            @click="dateClick(date)"
          >
            <view v-if="!date.isPreMonth && !date.isNextMonth">
              {{ date.date }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { parseTime, getDateList, compareDates } from './date-util'
export default {
  props: {
    timeFormatter: {
      type: String,
      default: 'yyyy-MM-dd', // 返回日期格式
    },
    value: {
      type: Date,
      default() {
        return new Date()
      },
    },
  },
  data() {
    const date = new Date()
    const years = []
    const year = date.getFullYear()
    const months = []
    const month = date.getMonth() + 1
    const days = []
    const day = date.getDate()
    for (let i = 1990; i <= date.getFullYear(); i++) {
      years.push(i)
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }
    for (let i = 1; i <= 31; i++) {
      days.push(i)
    }
    return {
      pageDate: new Date(),
      currentDate: this.value,
      current: 1,
      years,
      year,
      months,
      month,
      days,
      day,
      dateValue: [9999, month - 1, day - 1],
      indicatorStyle: 'height: 50px;'
    }
  },
  computed: {
    daysMap() {
      const d = this.pageDate
      const curs = getDateList(d, 1)

      curs.forEach((item) => {
        item.isHighlight = compareDates(item.dateObj, this.currentDate)
      })

      return curs
    },
  },
  watch: {
    value(val) {
      this.currentDate = val
    },
  },

  mounted() {},
  methods: {
    bindChange: function(e) {
      const val = e.detail.value
      this.year = this.years[val[0]]
      this.month = this.months[val[1]] - 1
      this.day = this.days[val[2]]
      this.pageDate = new Date(
        this.year,
        this.month,
        this.day
      )
      this.setCurrentDate()
    },
    dateClick(e) {
      const { dateObj, isPreMonth, isNextMonth } = e
      if (isPreMonth || isNextMonth) {
        return
      }

      // 复制副本
      this.currentDate = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate()
      )
      this.$emit('input', this.currentDate)
      this.$emit('on-selected', parseTime(this.currentDate, this.timeFormatter))
    },
    setCurrentDate() {
      // 切换月份或者年份
      const y = this.pageDate.getFullYear()
      const m = this.pageDate.getMonth()
      const d = this.pageDate.getDate()
      this.currentDate = new Date(y, m, d)
      this.$emit('input', this.currentDate)
      this.$emit('on-selected', parseTime(this.currentDate, this.timeFormatter))
    },
  },
}
</script>

<style lang="scss" scoped>
.z-calendar {
  width: 100%;
  .z-calendar-dates {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    font-weight: 400;
    color: #666666;
    font-size: 28rpx;
  }
  .z-calendar-date {
    height: 56rpx;
    width: calc(100% / 7);
    text-align: center;
    margin-top: 16rpx;
    line-height: 56rpx;
  }
  .z-calendar-date-inner {
    width: 56rpx;
    height: 56rpx;
    margin: 0 auto;
    position: relative;
  }
}

.ishighlight {
  background: #FF3167;
  color: #ffffff;
  border-radius: 50%;
}
.picker-view {
  width: 750rpx;
  height: 100rpx;
  margin: 20rpx 0;
}
.item {
  height: 100rpx;
  line-height: 100rpx;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #222222;
  font-weight: bold;
}
</style>
