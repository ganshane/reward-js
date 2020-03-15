import { rest } from '../api/index'
import { HAODANKU_API_NAMES } from './../constants'

function createHaodankuState () {
  const s = {}
  HAODANKU_API_NAMES.forEach(e => {
    s[e] = { 'data': [], 'min_id': 1 }
  })
  return s
}

function createHaodankuApi () {
  const methods = {}
  HAODANKU_API_NAMES.forEach(e => {
    methods[e] = function ({ commit, state }, parameters) {
      const parameterWithMinId = Object.assign({ min_id: state[e]['min_id'] }, parameters)
      rest['haodanku'][e].call(this, parameterWithMinId).then(res => {
        commit(e, res)
      })
    }
  })

  return methods
}

const mutations = {
  'itemlist' (state, res) {
    state.itemlist.data.push(...res.data)
    state.itemlist.min_id = res.min_id
    console.log('modiy itemlist')
  },
  'item_detail' (state, res) {
    state.item_detail.data = res.data
  },
  'supersearch' (state, res) {
    state.supersearch.data.push(...res.data)
    state.supersearch.min_id = res.min_id
  },
  'super_classify' (state, res) {
    state.super_classify.data = res.general_classify
    // state.super_classify.min_id = res.min_id
  },
  'column' (state, res) {
    state.column.data.push(...res.data)
    state.column.min_id = res.min_id
  }
}

export default {
  namespaced: true,
  state: createHaodankuState(),
  actions: createHaodankuApi(),
  mutations
}
