/*
 * @file: 登录注册接口
 */
import { get, post, put } from '@/utils/request'
import md5 from 'md5'

export default {
  state: {
    cargoMessage: {}, // 货方第一步记录下来的信息
    loginData: {}, // 登录保留下来的信息
    cargoPhoto: {}, // 货方重新审核保留下的图片
    userInfoBase: {} // 用户基本信息
  },
  mutations: {
    setCargoMessage(state, cargoMessage) {
      state.cargoMessage = cargoMessage
    },
    clearCargoMessage(state) {
      state.cargoMessage = {}
    },
    setLoginData(state, loginData) {
      uni.setStorageSync('loginData', JSON.stringify(loginData))
      state.loginData = loginData
    },
    clearLoginData(state) {
      uni.removeStorageSync('loginData')
      state.loginData = {}
    },
    setCargoPhoto(state, cargoPhoto) {
      state.cargoPhoto = cargoPhoto
    },
    clearCargPhoto(state) {
      state.cargoPhoto = {}
    },
    setUserInfoBase(state, userInfoBase) {
      uni.setStorageSync('userInfoBase', JSON.stringify(userInfoBase))
      state.userInfoBase = userInfoBase
    }
  },
  actions: {
    /**
     * @description: 获取验证码
     * @param {*} ctx
     * @param mobile 电话号码
     * @param type 验证码类型
     * @return {*}
     */
    async getVerifyCode(ctx, { mobile, type } = {}) {
      if (type === 0) { // 注册验证码
        return await post({
          url: '/lgh/security/api/msg/send/register',
          data: {
            mobile
          }
        })
      }
      if (type === 1) { // 登录验证码
        return await post({
          url: '/lgh/security/api/msg/send/login',
          data: {
            mobile
          }
        })
      }
      if (type === 2) { // 忘记密码验证码
        return await post({
          url: '/lgh/security/api/msg/send/forget',
          data: {
            mobile
          }
        })
      }
    },
    /**
     * @description: 船方注册
     * @param {*} ctx
     * @return {*}
     */
    async shipRegister(ctx, {
      mobile, // 手机号
      code, // 验证码
      name, // 姓名
      idCardNo, // 身份证号码
      password, // 密码
      handIdCardPhoto, // 手持身份证正反面照片 英文逗号隔开
      idCardPhoto, // 身份证正反面照片 英文逗号隔开
      facePhoto // 人脸识别照片 英文逗号隔开
    } = {}) {
      return await post({
        url: '/lgh/security/api/user/register/shipowner',
        data: {
          mobile,
          code,
          name,
          idCardNo,
          password: md5(password),
          handIdCardPhoto,
          idCardPhoto,
          facePhoto
        }
      })
    },
    /**
     * @description: 货方注册
     * @param {*} ctx
     * @return {*}
     */
    async cargoRegister(ctx, {
      mobile, // 手机号
      code, // 验证码
      password, // 密码
      name, // 名字
      idCardNo, // 身份证号码
      companyName, // 公司名称
      socialCreditCode, // 统一社会信用代码
      handIdCardPhoto, // 手持身份证正反面照片 英文逗号隔开
      idCardPhoto, // 身份证正反面照片 英文逗号隔开
      holdBusinessLicense, // 双手抱营业执照半身照 英文逗号隔开
      businessLicense, // 营业执照 英文逗号隔开
      authorityCertificate // 单位授权证明 英文逗号隔开
    } = {}) {
      return await post({
        url: '/lgh/security/api/user/register/shipper',
        data: {
          mobile,
          code,
          password: md5(password),
          name,
          idCardNo,
          companyName,
          socialCreditCode,
          handIdCardPhoto,
          idCardPhoto,
          holdBusinessLicense,
          businessLicense,
          authorityCertificate
        }
      })
    },
    /**
     * @description: 忘记密码
     * @param {*} ctx
     * @param mobile 电话号码
     * @param mobileCode 验证码
     * @param newPassword 新密码
     * @param confirmNewPassword 确认新密码
     * @return {*}
     */
    async forgetPassword(ctx, { mobile, mobileCode, newPassword, confirmNewPassword } = {}) {
      return await put({
        url: '/lgh/security/api/user/forgetPassword',
        data: {
          mobile,
          mobileCode,
          newPassword: md5(newPassword),
          confirmNewPassword: md5(confirmNewPassword)
        }
      })
    },
    /**
     * @description: 用户登录(验证码)
     * @param {*} ctx
     * @param mobile 电话号码
     * @param mobileCode 验证码
     * @return {*}
     */
    async codeLogin(ctx, { mobile, mobileCode } = {}) {
      const data = await post({
        url: '/lgh/security/api/user/login/mobile',
        data: {
          mobile,
          mobileCode
        }
      })
      if (data && data.code === 200 && data.data.status === 2) {
        uni.setStorageSync('token', data.data.accessToken)
      }
      if (data && data.code === 200) {
        ctx.commit('setLoginData', data.data)
        await ctx.dispatch('getUserInfoBase')

      }
      return data
    },
    /**
     * @description: 用户登录
     * @param {*} ctx
     * @param mobile 电话号码
     * @param password 登录密码
     * @return {*}
     */
    async login(ctx, { mobile, password } = {}) {
      const data = await post({
        url: '/lgh/security/api/user/login',
        data: {
          mobile,
          password: md5(password)
        }
      })
      if (data && data.code === 200 && data.data.status === 2) {
        uni.setStorageSync('token', data.data.accessToken)
      }
      if (data && data.code === 200) {
        ctx.commit('setLoginData', data.data)
        await ctx.dispatch('getUserInfoBase')
      }
      console.log(ctx);
      return data
    },
    /**
     * @description: 获取用户注册信息
     * @param {*} ctx
     * @param userId 用户ID
     * @return {*}
     */
    async getUserRegisterInfo(ctx, { userId } = {}) {
      const data = await get({
        url: '/lgh/security/api/user/userInfo',
        data: {
          userId
        }
      })
      return data
    },
    /**
     * @description: 审核失败重新申请认证
     * @param {*} ctx
     * @return {*}
     */
    async modifyRegister(ctx, {
      id, // 用户id
      mobile, // 手机号
      name, // 姓名
      code, // 验证码
      password, // 登录密码
      idCardNo, // 身份证号码
      handIdCardPhoto, // 手持身份证正反面照片 英文逗号隔开
      idCardPhoto, // 身份证正反面照片 英文逗号隔开
      holdBusinessLicense, // 双手抱营业执照半身照 英文逗号隔开
      businessLicense, // 营业执照 英文逗号隔开
      companyName, // 公司名称
      socialCreditCode, // 统一社会信用代码
      facePhoto, // 人脸识别照片 英文逗号隔开
      authorityCertificate, // 单位授权证明 英文逗号隔开
    } = {}) {
      return await put({
        url: '/lgh/security/api/user/modifyRegister',
        data: {
          id,
          mobile,
          name,
          code,
          password: md5(password),
          idCardNo,
          handIdCardPhoto,
          idCardPhoto,
          holdBusinessLicense,
          businessLicense,
          companyName,
          socialCreditCode,
          facePhoto,
          authorityCertificate,
        }
      })
    },
    /**
     * @description: 获取验证码 (图片)
     * @param {*} ctx
     * @return {*}
     */
    async getImgCode(ctx) {
      const data = await get({
        url: '/lgh/universal/image/verification/get'
      })
      return data
    },
    /**
     * @description: 获取相关协议
     * @param {*} ctx
     * @param {*} code SERVICE_MOBILE客服电话，USER_AGREEMENT用户协议，PRIVATE_POLICY隐私政策，WALLET_SERVICE_AGREEMENT电子钱包服务协议，INVOICING_AGREEMENT委托代开发票协议
     * @return {*}
     */
    async getAgreement(ctx, { code } = {}) {
      const data = await get({
        url: '/lgh/operate/api/parameter/findValueByCode',
        data: {
          code
        }
      })
      return data
    },
    /**
     * 获取用户基本信息
     * @param {*} ctx 
     * @returns 
     */
     async getUserInfoBase(ctx, {} = {}) {
      const res = await get({
        url: '/lgh/security/api/user/info'
      })
      if (res && res.code === 200) {
        ctx.commit('setUserInfoBase', res.data)
      }
      return res
    },
  }
}