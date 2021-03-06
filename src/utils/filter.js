/**
 * @file: 过滤器
 * 使用方法: 无需引入, 直接在页面数据绑定处使用，如：<view>{{ createTime | date }}</view>
 */
export default {
  init(Vue) {
    /**
     * @description: 时间日期格式化
     * 使用方法:
     * 1、直接过滤：<view>{{ createTime | date }}</view>
     * 2、指定格式：<view>{{ createTime | date('yyyy/MM/dd') }}</view>
     */
    Vue.filter('date', function(date, format) {
      if (!date) return '-'
      if (date === '-' || date === '--') {
        return date
      }
      date = new Date(Number(date))
      const paddNum = function(num) {
        num += ''
        return num.replace(/^(\d)$/, '0$1')
      }
      // 指定格式字符
      const cfg = {
        yyyy: date.getFullYear(), // 年 : 4位
        yy: date.getFullYear().toString().substring(2), // 年 : 2位
        M: date.getMonth() + 1, // 月 : 如果1位的时候不补0
        MM: paddNum(date.getMonth() + 1), // 月 : 如果1位的时候补0
        d: date.getDate(), // 日 : 如果1位的时候不补0=
        dd: paddNum(date.getDate()), // 日 : 如果1位的时候补0
        hh: paddNum(date.getHours()), // 时
        mm: paddNum(date.getMinutes()), // 分
        ss: paddNum(date.getSeconds()) // 秒
      }
      format || (format = 'yyyy-MM-dd hh:mm:ss')
      return format.replace(/([a-z])(\1)*/ig, function(m) {
        return cfg[m]
      })
    })

  }
}
