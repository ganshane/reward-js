import store from './store'
import config from './config'
import api from './helpers'
import * as wxApi from './api/wx'
import { rest } from './api/index'

export class UserNotAuthorized {}
export default {
  version: '__VERSION__',
  config,
  store,
  api,
  wxApi,
  rest
}
export {
  config,
  store,
  api,
  wxApi,
  rest
}

// export * from './api'

