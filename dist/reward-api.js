/**
 * reward js api v1.0.2
 * (c) 2020 Jun Tsai
 * @license Apache-2.0
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue'), require('vuex'), require('flyio')) :
  typeof define === 'function' && define.amd ? define(['vue', 'vuex', 'flyio'], factory) :
  (global = global || self, global.Reward = factory(global.Vue, global.Vuex, global.fly));
}(this, (function (Vue, Vuex, fly) { 'use strict';

  Vue = Vue && Object.prototype.hasOwnProperty.call(Vue, 'default') ? Vue['default'] : Vue;
  Vuex = Vuex && Object.prototype.hasOwnProperty.call(Vuex, 'default') ? Vuex['default'] : Vuex;
  fly = fly && Object.prototype.hasOwnProperty.call(fly, 'default') ? fly['default'] : fly;

  var config = {
    haodankuApi: 'https://v2.api.haodanku.com',
    haodankuKey: 'maxd'
  };

  fly.config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  var baseHaodanku = function (apiName, parameterNames, defaultParameters, parameters) {
    var values = Object.assign(defaultParameters, parameters);
    var url = config.haodankuApi + '/' + apiName + '/apikey/' + config.haodankuKey;
    parameterNames.forEach(function (name) {
      if (values[name] !== undefined) { url += '/' + name + '/' + values[name]; }
    });
    return fly.get(url)
      .then(function (res) {
        return JSON.parse(res.data)
      })
  };
  var api = {
    /**
     * 商品列表页API
     * https://www.haodanku.com/api/detail/show/1.html
     * @param {*} parameters 见API描述页
     */
    itemlist: function itemlist (parameters) {
      var parameterNames = ['nav', 'cid', 'back', 'min_id', 'sort', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'tkrates_min', 'tkrates_max', 'tkmoney_min', 'item_type'];
      var defaultParameters = { nav: 3, cid: 0, back: 10, minId: 1 };
      return baseHaodanku('itemlist', parameterNames, defaultParameters, parameters)
    },
    /**
     * 单品详情API
     * https://www.haodanku.com/api/detail/show/16.html
     * @param {*} parameters 见API描述页
     */
    item_detail: function item_detail (parameters) {
      var parameterNames = ['itemid'];
      return baseHaodanku('item_detail', parameterNames, {}, parameters)
    },
    /**
     * 超级搜索API
     * https://www.haodanku.com/api/detail/show/19.html
     * @param {*} parameters 见API描述页
     */
    supersearch: function supersearch (parameters) {
      var parameterNames = ['keyword', 'back', 'min_id', 'tb_p', 'sort', 'is_tmall', 'is_coupon', 'limitrate', 'startprice'];
      return baseHaodanku('supersearch', parameterNames, {}, parameters)
    },
    /**
     * 超级分类API
     * https://www.haodanku.com/api/detail/show/9.html
     * @param {*} parameters 见API描述页
     */
    super_classify: function super_classify (parameters) {
      var parameterNames = [];
      return baseHaodanku('super_classify', parameterNames, {}, parameters)
    },
    /**
     * 超级分类API
     * https://www.haodanku.com/api/detail/show/9.html
     * @param {*} parameters 见API描述页
     */
    column: function column (parameters) {
      var parameterNames = ['type', 'back', 'min_id', 'sort', 'cid', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'item_type'];
      return baseHaodanku('column', parameterNames, {}, parameters)
    }
  };

  var HAODANKU_API_NAMES = ['itemlist', 'item_detail', 'supersearch', 'super_classify', 'column'];
  var createHaodankuState = function () {
    var s = {};
    HAODANKU_API_NAMES.forEach(function (e) {
      s[e] = { 'data': [], 'min_id': 1 };
    });
    return s
  };

  var state = createHaodankuState();

  var createHaodankuApi = function () {
    var methods = {};
    HAODANKU_API_NAMES.forEach(function (e) {
      methods[e] = function (ref, parameters) {
        var commit = ref.commit;
        var state = ref.state;

        var parameterWithMinId = Object.assign({ min_id: state[e]['min_id'] }, parameters);
        api[e].call(this, parameterWithMinId).then(function (res) {
          commit(e, res);
        });
      };
    });

    return methods
  };

  var actions = Object.assign({}, createHaodankuApi());
  console.log(actions);

  var mutations = {
    'itemlist': function itemlist (state, res) {
      var ref;

      (ref = state.itemlist.data).push.apply(ref, res.data);
      state.itemlist.min_id = res.min_id;
    },
    'item_detail': function item_detail (state, res) {
      state.item_detail.data = res.data;
    },
    'supersearch': function supersearch (state, res) {
      var ref;

      (ref = state.supersearch.data).push.apply(ref, res.data);
      state.supersearch.min_id = res.min_id;
    },
    'super_classify': function super_classify (state, res) {
      state.super_classify.data = res.data;
      // state.super_classify.min_id = res.min_id
    },
    'column': function column (state, res) {
      var ref;

      (ref = state.column.data).push.apply(ref, res.data);
      state.column.min_id = res.min_id;
    }
  };

  var goods = {
    namespaced: true,
    state: state,
    actions: actions,
    mutations: mutations
  };

  Vue.use(Vuex);
  var store = new Vuex.Store({
    modules: {
      goods: goods
    }
  });

  var index = {
    config: config,
    store: store,
    version: '1.0.2'
  };

  return index;

})));
