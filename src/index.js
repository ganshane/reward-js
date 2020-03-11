import Vue from 'vue'
import Vuex from 'vuex'

import store from './store'
import config from './config'
import api from './helpers'
// import * as rest from './api'

export {
  config,
  store,
  api
}
export * from './api'
