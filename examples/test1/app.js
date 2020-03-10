import 'babel-polyfill'
import Vue from 'vue'
import Counter from './Counter.vue'
import { config, store } from 'reward-api'

Vue.prototype.$store = store
config.haodankuKey = 'asdf'

console.log(store, '....')
new Vue({
  el: '#app',
  store,
  render: h => h(Counter)
})
