import Vue from 'vue'
import Vuex from 'vuex'

import store from './store'
import config from './config'
import api from './helpers'
import * as wxApi from './api/wx'
export class UserNotAuthorized {}

export {
  config,
  store,
  api,
  wxApi
}

export * from './api'

