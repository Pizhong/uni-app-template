// 参考：https://uniapp.dcloud.io/api/storage/storage?id=setstorage
const PREFIX = 'uni_'
export const setStorage = (key, data) => {
  key = PREFIX + key
  try {
    uni.setStorageSync(key, data)
  } catch (e) {
    // error
    console.error(`设置缓存${key}出错了`, e)
  }
}

export const getStorage = (key) => {
  key = PREFIX + key
  try {
    return uni.getStorageSync(key)
  } catch (e) {
    // error
    console.error(`获取缓存${key}出错了`, e)
  }
}

export const removeStorage = (key) => {
  key = PREFIX + key
  try {
    uni.removeStorageSync(key)
  } catch (e) {
    // error
    console.error(`删除缓存${key}出错了`, e)
  }
}

export const clearStorage = (key) => {
  try {
    uni.clearStorageSync()
  } catch (e) {
    // error
    console.error(`清空缓存${key}出错了`, e)
  }
}
