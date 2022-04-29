/*
 * @file: 存放公用方法
 * 使用方法: 已在全局引入，在页面无需引入，用"this.$utils.方法名"调用方法
 * 例如使用时间格式化方法时: this.$utils.formatDate(new Date(), 'yyyy-MM-dd')
 */
/**
 * @description: 参数转换函数, 把 {a: 1, b: 2} 对象形式的参数, 转换为 a=1&b=2 的字符串
 * @param {Object} params 对象形式的参数
 * @return {String} 字符串形式的参数, 如: a=1&b=2
 */
export function getParamsStr(params) {
  const list = []

  for (const key in params) {
    // eslint-disable-next-line no-prototype-builtins
    if (params.hasOwnProperty(key)) {
      let value = params[key] || ''
      if (typeof (value) === 'object') {
        value = JSON.stringify(value)
      }
      value = encodeURIComponent(value)
      list.push(`${key}=${value}`)
    }
  }
  const paramsStr = list.join('&')
  return paramsStr
}

/**
 * @description: 时间格式化, 把时间戳、时间字符串、Date对象转换为字符串
 * @param {Object, String, Number} date 需要转换的时间
 * @param {String} format 转换后的格式, 默认是: yyyy-MM-dd hh:mm:ss
 * @return {String} 转换后的时间, 如: 1970-01-01 00:00:00
 */
export function formatDate(date, format) {
  if (!date) {
    return '-'
  }
  if (date === '-' || date === '--') {
    return date
  }
  if (typeof date === 'string') {
    date = date.replace(/-/g, '/')
    if (date.indexOf('/') === -1) {
      date = Number(date)
    }
  }
  date = new Date(date)
  const paddNum = function(num) {
    num = String(num)
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
    ss: paddNum(date.getSeconds()), // 秒
  }

  format || (format = 'yyyy-MM-dd hh:mm:ss')
  return format.replace(/([a-z])(\1)*/gi, function(m) {
    return cfg[m]
  })
}

/**
 * 防抖
 * @param {Function} fn
 * @param {number} delay timeunit: millisecond
 */
export function debounce(fn, delay = 3000) {
  let timer = null
  return function() {
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.bind(this, ...args)()
      timer = null
    }, delay)
  }
}

/**
 * 判断点是否在圆内
 * @param {*} point 点坐标
 * @param {*} circle 圆心
 * @param {*} r 半径
 */
export function pointInsideCircle(point, circle, r) {
  if (r === 0) { return false }
  const dx = circle[0] - point[0]
  const dy = circle[1] - point[1]
  return (dx * dx + dy * dy) <= r * r
}

export default {
  getParamsStr,
  formatDate,
  debounce,
  pointInsideCircle
}
