import { UPDATE_GOODS } from './../types'
import api from './../fetch'

const HAODANKU_API_NAMES = ['itemlist', 'item_detail', 'supersearch', 'super_classify', 'column']
const createHaodankuState = function () {
  const s = {}
  HAODANKU_API_NAMES.forEach(e => {
    s[e] = { 'data': [], 'min_id': 1 }
  })
  return s
}

const state = {
  ... createHaodankuState()
}
const createHaodankuApi = function () {
  const methods = {}
  HAODANKU_API_NAMES.forEach(e => {
    methods[e] = function ({ commit, state }, parameters) {
      const parameterWithMinId = Object.assign({ min_id: state[e]['min_id'] }, parameters)
      api[e].call(this, parameterWithMinId).then(res => {
        commit(e, res)
      })
    }
  })
  return methods
}

const actions = {
  ...createHaodankuApi()
}
console.log(actions)

const mutations = {
  'itemlist' (state, res) {
    state.itemlist.data.push(...res.data)
    state.itemlist.min_id = res.min_id
  },
  'item_detail' (state, res) {
    state.item_detail.data = res.data
  },
  'supersearch' (state, res) {
    state.supersearch.data.push(...res.data)
    state.supersearch.min_id = res.min_id
  },
  'super_classify' (state, res) {
    state.super_classify.data = res.data
    // state.super_classify.min_id = res.min_id
  },
  'column' (state, res) {
    state.column.data.push(...res.data)
    state.column.min_id = res.min_id
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
