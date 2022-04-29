/*
 * @file: mock数据入口
 * 使用方法: 在 proxy 对象里面写入需要mock数据的接口以及对应的返回值.
 * key: 需要mock的接口地址
 * value: 请求 key 的接口地址返回的数据(支持mock语法, http://mockjs.com/examples.html)
 */
import Mock from 'mockjs'

const mock = Mock.mock

const proxy = {
}

export function mockInit() {
  for (const key in proxy) {
    mock(new RegExp(key), {
      code: 200,
      message: '成功',
      success: true,
      object: proxy[key]
    })
  }
}

export default proxy
