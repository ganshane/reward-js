<template>
  <view class='dialog-container' :hidden="!isShow">
    <view class='dialog-mask'></view>
    <view class='dialog-info'>
        <view class='dialog-title'>登录提示 </view>
        <view class='dialog-content'>需要你授权才能更好的服务</view>
        <view class='dialog-footer' :hidden="!isShowGetUser">
          <button class='dialog-btn' open-type="getUserInfo" @getuserinfo='bindGetUserInfo'>授权</button>
        </view>
        <view class='dialog-footer' :hidden="!isShowGetPhone">
          <button open-type="getPhoneNumber" :bindgetphonenumber="getPhoneNumber">获取手机号</button>
        </view>
    </view>
</view>
</template>
<script>
import {rest} from 'reward-api'
export default {
  data () {
    // 弹窗显示控制
    return {isShowGetUser: false, isShowGetPhone: false}
  },
  computed: {
    isShow () {
      return this.isShowGetUser || this.isShowGetPhone
    }
  },
  methods: {
    bindGetUserInfo (e) {
      this.isShowGetUser = false
      this.initUserInfo()
    },
    confirmEvent () {
      console.log('confirm event.....')
      this.isShowGetUser = false
    },
    getPhoneNumber (e) {
      console.log(e)
    },
    initUserInfo: function (e) {
      let code = ''
      wx.pro.login().then(res => {
        console.log('login res:', res)
        code = res.code
        return wx.pro.getSetting()
      }).then(userSettings => {
        if (userSettings.authSetting['scope.userInfo']) {
          // 授权了
          return wx.pro.getUserInfo()
        } else {
          this.isShowGetUser = true
          throw new Error('error')
        }
      }).then(res => {
        console.log('获取用户信息成功  ', res)
        this.isShowGetUser = false

        const data = {code, encrypted_data: res.encryptedData, iv: res.iv, raw_data: res.rawData, signature: res.signature}
        return rest.wx.login(data)
      }).then(res => {
        return rest.user.info()
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.initUserInfo()
  }
}
</script>
<style>
.dialog-mask{
  position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
}
.dialog-info{
    position: fixed;
    z-index: 5000;
    width: 80%;
    max-width: 600rpx;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: #FFFFFF;
    text-align: center;
    border-radius: 3px;
    overflow: hidden;
}
.dialog-title{
    font-size: 36rpx;
    padding: 30rpx 30rpx 10rpx;
}
.dialog-content{
    padding: 10rpx 30rpx 20rpx;
    min-height: 80rpx;
    font-size: 32rpx;
    line-height: 1.3;
    word-wrap: break-word;
    word-break: break-all;
    color: #999999;
}
.dialog-footer{
    display: flex;
    align-items: center;
    position: relative;
    line-height: 90rpx;
    font-size: 34rpx;
}
.dialog-btn{
    display: block;
    -webkit-flex: 1;
    flex: 1;
    position: relative;
    color: #3CC51F;
}
</style>