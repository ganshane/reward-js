import store from './store'
import { HAODANKU_API_NAMES } from './constants'

function createDispatchFunction () {
  const methods = {}
  HAODANKU_API_NAMES.forEach(el => {
    methods[el] = function (parameters) {
      store.dispatch(`goods/${el}`, parameters)
    }
  })
  return methods
}
function createStateDataFunction () {
  const methods = {}
  HAODANKU_API_NAMES.forEach(el => {
    methods[el + '_data'] = function () {
      return store.state['goods'][el]['data']
    }
  })
  return methods
}

export default {
  goods: {
    actions: { ...createDispatchFunction() },
    data: { ...createStateDataFunction() }
  }
}
