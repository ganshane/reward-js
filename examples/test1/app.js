import 'babel-polyfill'
import Vue from 'vue'
import Counter from './Counter.vue'
import { config, store } from 'reward-api'

config.haodankuKey = 'gofanli'
config.isWx = false

Vue.prototype.$store = store

new Vue({
  el: '#app',
  store,
  render: h => h(Counter)
})
