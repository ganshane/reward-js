import Vue from 'vue'
import Vuex from 'vuex'

import store from './store'
import config from './config'
import api from './helpers'

export default {
  config,
  store,
  api,
  version: '__VERSION__'
}
