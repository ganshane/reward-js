import 'babel-polyfill'
import Vue from 'vue'
import Index from './Index.vue'
import { config, store } from 'reward-api'

config.isWx = false
// config.api = 'http://localhost:8081'
Vue.prototype.$store = store

new Vue({
  el: '#app',
  store,
  render: h => h(Index)
})
