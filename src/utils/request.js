/*
 * @file: 接口请求共用模块, 包含: 请求重试, 请求取消, 请求/响应拦截, 限制同一时间请求个数等功能
 */
import Mock from 'mockjs'
import mockData from '../../mock/index.js'
import { getParamsStr } from './utils'

let requestNum = parseInt(process.env.VUE_APP_REQUEST_NUM)

// 接口请求取消
class CancelController {
  constructor() {
    this.requestTaskMap = {}
  }

  // 缓存上一次的请求
  push(uniqueKey, requestTask) {
    if (!this.requestTaskMap[uniqueKey] || this.requestTaskMap[uniqueKey] === 'cancel') {
      this.requestTaskMap[uniqueKey] = []
    }
    this.requestTaskMap[uniqueKey].push(requestTask)
  }

  // 终止请求
  cancel(uniqueKey) {
    if (!this.requestTaskMap[uniqueKey] || this.requestTaskMap[uniqueKey] === 'cancel') return true
    this.requestTaskMap[uniqueKey].forEach(requestTask => {
      requestTask.abort()
    })
    this.requestTaskMap[uniqueKey] = 'cancel'
  }

  start(url, requestTask) {
    const uniqueKey = url
    this.cancel(uniqueKey)
    this.push(uniqueKey, requestTask)
    return requestTask
  }
}

const cancelController = new CancelController()

// 请求队列, 用于限制同一时间请求的个数
class RequestList {
  constructor() {
    this.requestList = [] // 请求队列(只记录url)
    this.waitList = [] // 等待队列
  }

  // 进入请求队列
  pushRequest(url) {
    if (this.requestList.indexOf(url) === -1) {
      this.requestList.push(url)
    }
  }

  // 进入等待队列
  pushWait(url, options, cb) {
    let isExit = false
    this.waitList.some((item) => {
      if (item.url === url) {
        isExit = true
        return isExit
      }
      return false
    })
    if (!isExit) {
      this.waitList.push({
        url,
        options,
        cb
      })
    }
  }

  // 请求下一个(当前请求出队并请求等待队列中的第一个等待)
  requestNext(url) {
    if (this.requestList.indexOf(url) !== -1) {
      this.requestList.splice(this.requestList.indexOf(url), 1)
      // 若请求已经完成,调用终止请求的方法会导致报错。所以请求完成后需要清除请求缓存
      if (cancelController.requestTaskMap[url]) {
        delete cancelController.requestTaskMap[url]
      }
    }
    while (this.waitList.length > 0 && this.requestList.length < requestNum) {
      const next = this.waitList.shift()
      next.cb && next.cb(request(next.options))
    }
  }

  // 检查接口是否在请求或处于请求队列中
  checkRequest(url) {
    let isRequesting = false
    this.requestList.some(item => {
      if (item === url) {
        isRequesting = true
        return true
      }
      return false
    })
    this.waitList.some(item => {
      if (item.url === url) {
        isRequesting = true
        return true
      }
      return false
    })
    return isRequesting
  }
}
const requestList = new RequestList()

// 接口重试
class RetryController {
  constructor(request, options) {
    if (typeof request !== 'function') throw new Error('request参数仅支持函数类型')
    if (!options) throw new Error('options参数不允许为空')
    this.request = request
    this.options = options
  }

  async tryRequest() {
    try {
      return await this.request(this.options)
    } catch (e) {
      return this.start(e)
    }
  }

  // 网络请求超时，发起重试
  async start(response) {
    if (cancelController.requestTaskMap[this.options.url] === 'cancel') {
      // 接口被取消
      throw response
    }
    if (response.errMsg !== 'request:fail timeout') throw response

    if (!this.options.config) {
      this.options.config = {
        retry: parseInt(process.env.VUE_APP_RETRY)
      }
    }
    if (this.options.config.retry === undefined) {
      this.options.config.retry = parseInt(process.env.VUE_APP_RETRY)
    }
    if (this.options.config.retry > 0) {
      this.options.config.retry--
      return this.tryRequest()
    }
    throw response
  }
}

const showLoading = (ifHideLoading) => {
  !ifHideLoading && uni.showLoading({
    title: '加载中'
  })
}

const hideLoading = () => {
  uni.hideLoading()
}

/**
 * @description: 接口请求
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {String} method 请求方式, 默认是 GET, 有效值: GET POST PUT DELETE
 * @param {Object} header 请求头
 * @param {Number} timeout 超时时间,单位ms.
 * @param {String} dataType 数据类型, 默认是 json
 * @param {String} responseType 设置响应的数据类型, 默认是 text, 合法值：text、arraybuffer
 * @param {Boolean} cancel 是否取消上一次未完成请求，默认值true
 * @param {Boolean} isNotJoinDomain 是否不需要拼接域名, 默认值false。 true:不拼接域名, false:拼接域名
 * @return {Promise} Promise对象
 */
function request(options) {
  let { url, data, method, header, timeout, dataType, responseType, cancel = true, isNotJoinDomain = false } = options
  if (!url) {
    throw new Error('url不允许为空')
  }
  for (const key in data) {
    if (data[key] === undefined) {
      delete data[key]
    }
  }
  timeout = timeout || parseInt(process.env.VUE_APP_TIMEOUT)
  dataType = dataType || 'json'
  responseType = responseType || 'text'
  method = method || 'GET'
  header = header || { 'Content-Type': 'application/json;charset=utf-8;' }
  header.Authorization = uni.getStorageSync('token') || ''
  // #ifndef H5
  // 小程序端、APP端的mock数据
  if (process.env.VUE_APP_MOCK === '1') {
    return new Promise((resolve, reject) => {
      if (mockData[url]) {
        resolve({
          code: 0,
          msg: '成功',
          data: Mock.mock(mockData[url])
        })
      } else {
        reject(new Error(`invalid url "${url}"`))
      }
    })
  }
  // #endif
  const originUrl = url
  if (!url.startsWith('http') && !url.startsWith('//') && !isNotJoinDomain) {
    url = `${process.env.VUE_APP_DOMAIN}${url}`
  }
  console.info(url)
  if (requestList.requestList.length < requestNum || requestList.requestList.indexOf(originUrl) !== -1) {
    requestList.pushRequest(originUrl)
    return new Promise((resolve, reject) => {
      const requestTask = uni.request({
        url,
        data,
        method,
        header,
        timeout,
        dataType,
        responseType,
        success({ data }) {
          // 登录校验
          if (data.code === 403) {
            uni.reLaunch({ url: '/pages/login/login' })
            return reject(data)
          }
          if (!data || data.code !== 200) {
            uni.showToast({ title: data.msg, icon: 'none' })
            return reject(data)
          }
          resolve(data)
        },
        fail(res) {
          console.info('fail ', res)
          reject(res)
        }
      })
      // 多次请求同一个接口取消上一次未完成请求
      if (cancel) {
        cancelController.start(originUrl, requestTask)
      }
    })
  } else {
    return new Promise((resolve) => {
      requestList.pushWait(originUrl, options, (res) => {
        resolve(res)
      })
    })
  }
}

/**
 * post 请求
 * @param {Object} options 请求参数Object,字段与request相同
 * @param {Boolean} options.ifHideLoading 是否隐藏loading弹窗
 * @param {Boolean} options.isQueue 是否让后面的请求排队, 默认值false. 开启后请求队列变成一次只能请求一个接口直到此接口请求完成
 */
export async function post(options) {
  if (options.isQueue) {
    requestNum = 1
  }
  // 若请求在请求队列中，则终止请求
  if (requestList.checkRequest(options.url)) {
    return
  }
  showLoading(options.ifHideLoading)
  options.method = 'POST'
  let res = null
  try {
    res = await request(options)
  } catch (err) {
    if (!err.code) {
      try {
        // 超时重试
        const retryController = new RetryController(request, options)
        res = await retryController.start(err)
      } catch {
        uni.showToast({ title: '网络错误，请稍后再试', icon: 'none' })
        hideLoading()
        requestList.requestNext(options.url)
        throw new Error('网络错误，请稍后再试')
      }
    } else {
      res = err
    }
  }
  hideLoading()
  if (options.isQueue) {
    requestNum = parseInt(process.env.VUE_APP_REQUEST_NUM)
  }
  requestList.requestNext(options.url)
  return res
}

export async function get(options) {
  if (options.isQueue) {
    requestNum = 1
  }
  // 若请求在请求队列中，则终止请求
  if (requestList.checkRequest(options.url)) {
    return
  }
  // get请求参数为空删除
  for (const key in options.data) {
    if (options.data[key] === '') {
      delete options.data[key]
    }
  }
  showLoading(options.ifHideLoading)
  let res = null
  try {
    res = await request(options)
  } catch (err) {
    if (!err.code) {
      try {
      // 重试
        const retryController = new RetryController(request, options)
        res = await retryController.start(err)
      } catch {
        uni.showToast({ title: '网络错误，请稍后再试', icon: 'none' })
        hideLoading()
        requestList.requestNext(options.url)
        throw new Error('网络错误，请稍后再试')
      }
    } else {
      res = err
    }
  }
  hideLoading()
  if (options.isQueue) {
    requestNum = parseInt(process.env.VUE_APP_REQUEST_NUM)
  }
  requestList.requestNext(options.url)
  return res
}
export async function put(options) {
  if (options.isQueue) {
    requestNum = 1
  }
  // 若请求在请求队列中，则终止请求
  if (requestList.checkRequest(options.url)) {
    return
  }
  showLoading(options.ifHideLoading)
  options.method = 'PUT'
  let res = null
  try {
    res = await request(options)
  } catch (err) {
    if (!err.code) {
      try {
        // 超时重试
        const retryController = new RetryController(request, options)
        res = await retryController.start(err)
      } catch {
        uni.showToast({ title: '网络错误，请稍后再试', icon: 'none' })
        hideLoading()
        requestList.requestNext(options.url)
        throw new Error('网络错误，请稍后再试')
      }
    } else {
      res = err
    }
  }
  hideLoading()
  if (options.isQueue) {
    requestNum = parseInt(process.env.VUE_APP_REQUEST_NUM)
  }
  requestList.requestNext(options.url)
  return res
}
export async function del(options) {
  if (options.isQueue) {
    requestNum = 1
  }
  // 若请求在请求队列中，则终止请求
  if (requestList.checkRequest(options.url)) {
    return
  }
  showLoading(options.ifHideLoading)
  options.method = 'DELETE'
  let res = null
  try {
    res = await request(options)
  } catch (err) {
    if (!err.code) {
      try {
        // 超时重试
        const retryController = new RetryController(request, options)
        res = await retryController.start(err)
      } catch {
        uni.showToast({ title: '网络错误，请稍后再试', icon: 'none' })
        hideLoading()
        requestList.requestNext(options.url)
        throw new Error('网络错误，请稍后再试')
      }
    } else {
      res = err
    }
  }
  hideLoading()
  if (options.isQueue) {
    requestNum = parseInt(process.env.VUE_APP_REQUEST_NUM)
  }
  requestList.requestNext(options.url)
  return res
}
/**
 * 终止请求
 * @param {*} url 需要终止请求的接口地址
 */
export function cancel(url) {
  cancelController.cancel(url)
  requestList.requestNext(url)
  hideLoading()
}

/**
 * 下载
 * 1、H5端下载使用 a标签实现
 * 2、微信小程序
 * （1）只支持保存图片到相册
 * （2）文件类型（pdf，excel，word，ppt）使用 openDocument 打开文件预览
 * @param {*} url 地址
 * @param {*} data 参数
 */
export function download({ url, data } = {}) {
  if (!url.startsWith('http') && !url.startsWith('//')) {
    url = `${process.env.VUE_APP_DOMAIN}${url}`
  }
  let params = ''
  if (data) {
    params = getParamsStr(data)
  }
  if (params) {
    if (url.indexOf('?') === -1) {
      url = url + '?' + params
    } else {
      url = url + '&' + params
    }
  }
  // #ifdef H5
  const saveLink = document.createElement('a')
  saveLink.href = url
  saveLink.target = '_blank'
  saveLink.click()
  // #endif
  // #ifdef APP-PLUS
  uni.downloadFile({
    url: url,
    success: (res) => {
      uni.openDocument({
        filePath: res.tempFilePath,
        fial: (err) => {
          console.info(err)
        }
      })
    }
  })
  // #endif
  // #ifdef MP-WEIXIN
  let fileType = 0 // 0 其他 1文件 2图片
  const fileRepx = /(docx|doc|xls|xlsx|ppt|pptx|pdf)$/i
  const imgRepx = /(gif|jpeg|png|jpg|bmp|ico|tif|pcx|raw|tga|tiff|pjp|jfif|svg|)$/i
  if (fileRepx.test(url)) {
    fileType = 1
  } else if (imgRepx.test(url)) {
    fileType = 2
  }
  uni.downloadFile({
    url: url,
    success: (res) => {
      if (fileType === 1) {
        uni.openDocument({
          filePath: res.tempFilePath,
          fial: (err) => {
            console.info(err)
          }
        })
      } else if (fileType === 2) {
        uni.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          fial: (err) => {
            console.info(err)
          }
        })
      }
    }
  })
  // #endif
}

export default {
  post,
  get,
  cancel,
  download
}
