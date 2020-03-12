import { rest, UserNotAuthorized } from '..'
function exportWxApi () {
  if (typeof (wx) !== 'undefined') {
    const promisifyAll = require('wx-promise-pro')
    promisifyAll()

    return {
      getUserInfo: () => {
        let code = ''
        return wx.pro.login().then(res => {
          console.log('login res:', res)
          code = res.code
          return wx.pro.getSetting()
        }).then(userSettings => {
          if (userSettings.authSetting['scope.userInfo']) {
            // 授权了
            return wx.pro.getUserInfo()
          } else {
            throw new UserNotAuthorized()
          }
        }).then(res => {
          console.log('从微信获取用户信息成功  ', res)
          const data = { code, encrypted_data: res.encryptedData, iv: res.iv, raw_data: res.rawData, signature: res.signature }
          return rest.wx.login(data)
        }).then(res => {
          console.log('登录API服务器成功', res)
          return rest.user.info()
        })
      }
    }
  }
}

export const wxApi = exportWxApi()

