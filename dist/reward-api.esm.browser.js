/**
 * reward js api v1.0.1
 * (c) 2020 Jun Tsai
 * @license Apache-2.0
 */
import Vue from 'vue';
import Vuex from 'vuex';
import fly from 'flyio';

var config = {
  haodankuApi: 'https://v2.api.haodanku.com',
  haodankuKey: 'maxd'
};

fly.config.headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

const baseHaodanku = function (apiName, parameterNames, defaultParameters, parameters) {
  const values = Object.assign(defaultParameters, parameters);
  let url = config.haodankuApi + '/' + apiName + '/apikey/' + config.haodankuKey;
  parameterNames.forEach(name => {
    if (values[name] !== undefined) url += '/' + name + '/' + values[name];
  });
  return fly.get(url)
    .then(res => {
      return JSON.parse(res.data)
    })
};
var api = {
  /**
   * 商品列表页API
   * https://www.haodanku.com/api/detail/show/1.html
   * @param {*} parameters 见API描述页
   */
  itemlist (parameters) {
    const parameterNames = ['nav', 'cid', 'back', 'min_id', 'sort', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'tkrates_min', 'tkrates_max', 'tkmoney_min', 'item_type'];
    const defaultParameters = { nav: 3, cid: 0, back: 10, minId: 1 };
    return baseHaodanku('itemlist', parameterNames, defaultParameters, parameters)
  },
  /**
   * 单品详情API
   * https://www.haodanku.com/api/detail/show/16.html
   * @param {*} parameters 见API描述页
   */
  item_detail (parameters) {
    const parameterNames = ['itemid'];
    return baseHaodanku('item_detail', parameterNames, {}, parameters)
  },
  /**
   * 超级搜索API
   * https://www.haodanku.com/api/detail/show/19.html
   * @param {*} parameters 见API描述页
   */
  supersearch (parameters) {
    const parameterNames = ['keyword', 'back', 'min_id', 'tb_p', 'sort', 'is_tmall', 'is_coupon', 'limitrate', 'startprice'];
    return baseHaodanku('supersearch', parameterNames, {}, parameters)
  },
  /**
   * 超级分类API
   * https://www.haodanku.com/api/detail/show/9.html
   * @param {*} parameters 见API描述页
   */
  super_classify (parameters) {
    const parameterNames = [];
    return baseHaodanku('super_classify', parameterNames, {}, parameters)
  },
  /**
   * 超级分类API
   * https://www.haodanku.com/api/detail/show/9.html
   * @param {*} parameters 见API描述页
   */
  column (parameters) {
    const parameterNames = ['type', 'back', 'min_id', 'sort', 'cid', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'item_type'];
    return baseHaodanku('column', parameterNames, {}, parameters)
  }
};

const HAODANKU_API_NAMES = ['itemlist', 'item_detail', 'supersearch', 'super_classify', 'column'];
const createHaodankuState = function () {
  const s = {};
  HAODANKU_API_NAMES.forEach(e => {
    s[e] = { 'data': [], 'min_id': 1 };
  });
  return s
};

const state = createHaodankuState();

const createHaodankuApi = function () {
  const methods = {};
  HAODANKU_API_NAMES.forEach(e => {
    methods[e] = function ({ commit, state }, parameters) {
      const parameterWithMinId = Object.assign({ min_id: state[e]['min_id'] }, parameters);
      api[e].call(this, parameterWithMinId).then(res => {
        commit(e, res);
      });
    };
  });

  return methods
};

const actions = {
  ...createHaodankuApi()
};
console.log(actions);

const mutations = {
  'itemlist' (state, res) {
    state.itemlist.data.push(...res.data);
    state.itemlist.min_id = res.min_id;
  },
  'item_detail' (state, res) {
    state.item_detail.data = res.data;
  },
  'supersearch' (state, res) {
    state.supersearch.data.push(...res.data);
    state.supersearch.min_id = res.min_id;
  },
  'super_classify' (state, res) {
    state.super_classify.data = res.data;
    // state.super_classify.min_id = res.min_id
  },
  'column' (state, res) {
    state.column.data.push(...res.data);
    state.column.min_id = res.min_id;
  }
};

var goods = {
  namespaced: true,
  state,
  actions,
  mutations
};

Vue.use(Vuex);
var store = new Vuex.Store({
  modules: {
    goods
  }
});

var index_esm = {
  config,
  store,
  version: '1.0.1'
};

export default index_esm;
export { config, store };
