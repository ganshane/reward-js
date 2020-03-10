import { UPDATE_GOODS } from './../types'
import api from './../fetch'

const state = {
  list: [],
  miniId: 1
}

const actions = {
  /**
   *
   * @param {store} store 参数
   * @param {*} nav,cid,back分别参加好单库的API参数说明
   * @see https://www.haodanku.com/api/detail/show/1.html
   */
  findGoods ({ commit, state }, { nav, cid, back }) {
    api.fetchGoods({ minId: state.miniId, nav, cid, back }).then(res => {
      commit(UPDATE_GOODS, res)
    })
  }
}

const mutations = {
  [UPDATE_GOODS] (state, res) {
    state.list.push(...res.data)
    state.miniId = res.min_id
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
