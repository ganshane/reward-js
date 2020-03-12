
<template>
  <div id="app">
    <button @click="clearToken">clear token</button> <br/>
    <input type="text" v-model="phone"/>
    <button @click="sendSms">sendSms</button> <br/>
    phone<input type="text" v-model="phone"/>
    code<input type="text" v-model="code"/>
    <button @click="login">login</button> <br/>
    token<input type="text" v-model="token"/>
    <button @click="getUserInfo">userinfo</button> <br/>
    {{userinfo}}
  </div>
</template>

<script>
import { rest } from 'reward-api'

export default {
  data: () => {
    return { phone: '', code: '', userinfo: {}, token: '' }
  },
  computed: {
  },
  methods: {
    clearToken () { rest.user.clearToken() },
    sendSms () {
      rest.user.sendSms(this.phone)
    },
    login () {
      rest.user.login({ phone: this.phone, code: this.code }).then(data => {
        this.token = data.token
      })
    },
    getUserInfo () {
      rest.user.setToken(this.token)
      rest.user.info().then(data => { this.userinfo = data })
    }
  }
}
</script>
