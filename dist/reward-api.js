/**
 * reward-api v1.0.26
 * (c) 2020 Jun Tsai
 * @license Apache-2.0
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue'), require('vuex'), require('wx-promise-pro')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue', 'vuex', 'wx-promise-pro'], factory) :
  (global = global || self, factory(global['reward-api'] = {}, global.vue, global.vuex, global['wx-promise-pro']));
}(this, (function (exports, Vue, Vuex, wxPromisePro) { 'use strict';

  Vue = Vue && Object.prototype.hasOwnProperty.call(Vue, 'default') ? Vue['default'] : Vue;
  Vuex = Vuex && Object.prototype.hasOwnProperty.call(Vuex, 'default') ? Vuex['default'] : Vuex;

  var config = {
    haodankuApi: 'https://v2.api.haodanku.com',
    haodankuKey: 'gofanli',
    haodanku_taobao_name: 'zhyj_cn',
    taobaoke_pid: 'mm_19052242_1281300405_110017350452',
    api: 'https://api.gofanli.cn',
    isWx: false
  };

  function createFlyInstance () {
    if (config.isWx || typeof (wx) !== 'undefined') {
      var Fly = require('flyio/dist/npm/wx');
      return new Fly()
    } else {
      return require('flyio')
    }
  }

  var fly = createFlyInstance();

  var FORM_DATA_HEADER = { headers: { 'content-type': 'application/x-www-form-urlencoded' }};

  var postApi = function (api, data) {
    return fly.post(("" + (config.api) + api), data, FORM_DATA_HEADER).then(function (res) { return res.data; })
  };
  var getApi = function (api, data) { return fly.get(("" + (config.api) + api), data).then(function (res) { return res.data; }); };
  var internalSetToken = function (token) { fly.config.headers = Object.assign(fly.config.headers, { 'Authorization': 'Bearer ' + token }); };
  var taofenxiang = {
    public: {
      announces: function () { return getApi('/public/announces'); },
      slides: function () { return getApi('/public/slides'); }
    },
    admin: {
      add_card: function (ref) {
        var no = ref.no;
        var secret = ref.secret;
        var amount = ref.amount;
        var created_id = ref.created_id;

        return postApi('/admin/card/add', { no: no, secret: secret, amount: amount, created_id: created_id });
  },
      cards: function (ref) {
        var page = ref.page;
        var size = ref.size;
        var sort = ref.sort;

        return postApi('/admin/card/list', { page: page, size: size, sort: sort });
  },

      add_slide: function (ref) {
        var img_url = ref.img_url;
        var url = ref.url;
        var status = ref.status;

        return postApi('/admin/slide/add', { img_url: img_url, url: url, status: status });
  },
      delete_slide: function (id) { return postApi('/admin/slide/delete', { id: id }); },
      update_status: function (ref) {
        var id = ref.id;
        var status = ref.status;

        return postApi('/admin/slide/status', { id: id, status: status });
  },
      slides: function () { return getApi('/admin/slide/list'); },

      add_announce: function (ref) {
        var content = ref.content;
        var url = ref.url;

        return postApi('/admin/announce/add', { content: content, url: url });
  },
      delete_announce: function (id) { return postApi('/admin/announce/delete', { id: id }); },
      announces: function () { return getApi('/admin/announce/list'); },
      users: function (ref) {
        var page = ref.page;
        var size = ref.size;
        var sort = ref.sort;

        return postApi('/admin/users', { page: page, size: size, sort: sort });
  }
    },
    consumption: {
      add: function (ref) {
        var amount = ref.amount;
        var item_id = ref.item_id;
        var item_img = ref.item_img;
        var item_link = ref.item_link;

        return postApi('/consumption/add', { amount: amount, item_id: item_id, item_img: item_img, item_link: item_link });
  },
      list: function (ref) {
        var page = ref.page;
        var size = ref.size;
        var sort = ref.sort;

        return postApi('/consumption/list', { page: page, size: size, sort: sort });
  }
    },
    recharge: {
      add: function (ref) {
        var no = ref.no;
        var secret = ref.secret;

        return postApi('/recharge/add', { no: no, secret: secret });
  },
      list: function (ref) {
        var page = ref.page;
        var size = ref.size;
        var sort = ref.sort;

        return postApi('/recharge/list', { page: page, size: size, sort: sort });
  }
    },
    user: {
      setToken: internalSetToken,
      clearToken: function () { delete fly.config.headers['Authorization']; },
      info: function () { return getApi('/user/info'); },
      sendSms: function (phone) { return postApi('/user/sendSms', { phone: phone }); },
      login: function (ref) {
        var phone = ref.phone;
        var code = ref.code;

        return postApi('/user/login', { phone: phone, code: code }).then(function (data) {
          internalSetToken(data.token);
          return data
        })
      }
    },
    wx: {
      login: function (data) {
        return postApi('/wx/login', data)
          .then(function (data) {
            internalSetToken(data.token);
            return data
          })
      }
    }
  };

  // remove Authorization header
  fly.interceptors.request.use(function (request) {
    if (request.url.indexOf('haodanku.com') > 0) {
      delete request.headers['Authorization'];
    }
  });

  var FORM_DATA_HEADER$1 = { headers: { 'content-type': 'application/x-www-form-urlencoded' }};
  function baseHaodanku (apiName, parameterNames, defaultParameters, parameters) {
    var values = Object.assign(defaultParameters, parameters);
    var url = config.haodankuApi + '/' + apiName + '/apikey/' + config.haodankuKey;
    parameterNames.forEach(function (name) {
      if (values.hasOwnProperty(name)) { url += '/' + name + '/' + values[name]; }
    });
    return fly.get(url, {}, FORM_DATA_HEADER$1)
      .then(function (res) {
        var resData = (typeof (res.data) === 'string') ? JSON.parse(res.data) : res.data;
        if (resData.code === 0) {
          console.error('抓取数据失败,服务器消息:', resData.msg);
          throw new Error(resData.msg)
        } else {
          return resData
        }
      })
  }
  /**
     * 商品列表页API
     * https://www.haodanku.com/api/detail/show/1.html
     * @param {*} parameters 见API描述页
     */
  var itemlist = function (parameters) {
    var parameterNames = ['nav', 'cid', 'back', 'min_id', 'sort', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'tkrates_min', 'tkrates_max', 'tkmoney_min', 'item_type'];
    var defaultParameters = { nav: 3, cid: 0, back: 10, minId: 1 };
    return baseHaodanku('itemlist', parameterNames, defaultParameters, parameters)
  };

  /**
   * 高佣api调用
   * https://www.haodanku.com/api/detail/show/15.html
   * @param {itemid} parameters  商品id
   */
  var ratesurl = function (parameters) {
    var defaultParameters = { 'apikey': config.haodankuKey, 'tb_name': config.haodanku_taobao_name, 'pid': config.taobaoke_pid };
    var values = Object.assign(defaultParameters, parameters);
    return fly.post(((config.haodanku_taobao_name) + "/ratesurl"), values, FORM_DATA_HEADER$1)
      .then(function (res) {
        var resData = (typeof (res.data) === 'string') ? JSON.parse(res.data) : res.data;
        if (resData.code === 0) {
          console.error('抓取数据失败,msg:', resData.msg);
          throw new Error(resData.msg)
        } else {
          return resData
        }
      })
  };

  /**
   * 今日值得买API
   * https://www.haodanku.com/api/detail/show/28.html
   */
  var get_deserve_item = function () {
    var parameterNames = [];
    return baseHaodanku('get_deserve_item', parameterNames, {}, {})
  };
  /**
   * 抖货商品API
   * https://www.haodanku.com/api/detail/show/32.html
   * @param {min_id,cat_id,order,back} parameters itemid
   */
  var get_trill_data = function (parameters) {
    var parameterNames = ['min_id', 'cat_id', 'order', 'back'];
    return baseHaodanku('get_trill_data', parameterNames, {}, parameters)
  };
  /**
   * 精选低价包邮专区API
   * https://www.haodanku.com/api/detail/show/36.html
   * @param {min_id, order, type} parameters itemid
   */
  var low_price_Pinkage_data = function (parameters) {
    var parameterNames = ['min_id', 'order', 'type'];
    return baseHaodanku('low_price_Pinkage_data', parameterNames, {}, parameters)
  };
  /**
   * 品牌列表API
   * https://www.haodanku.com/api/detail/show/31.html
   * @param {min_id, back, brandcat} parameters itemid
   */
  var brandinfo = function (parameters) {
    var parameterNames = ['min_id', 'back', 'brandcat'];
    return baseHaodanku('brandinfo', parameterNames, {}, parameters)
  };
  /**
   * 各大榜单API
   * https://www.haodanku.com/api/detail/show/29.html
   * @param {sale_type, min_id, cid, back, item_type} parameters itemid
   */
  var sales_list = function (parameters) {
    var parameterNames = ['sale_type', 'min_id', 'cid', 'back', 'item_type'];
    return baseHaodanku('sales_list', parameterNames, {}, parameters)
  };
  /**
   * 朋友圈API
   * https://www.haodanku.com/api/detail/show/23.html
   * @param {min_id} parameters itemid
   */
  var selected_item = function (parameters) {
    var parameterNames = ['min_id'];
    return baseHaodanku('selected_item', parameterNames, {}, parameters)
  };
  /**
   * 热搜关键词记录API
   * https://www.haodanku.com/api/detail/show/6.html
   */
  var hot_key = function () {
    var parameterNames = [];
    return baseHaodanku('hot_key', parameterNames, {}, {})
  };
  /**
   * 猜你喜欢API
   * https://www.haodanku.com/api/detail/show/17.html
   * @param {itemid} parameters itemid
   */
  var get_similar_info = function (parameters) {
    var parameterNames = ['itemid'];
    return baseHaodanku('get_similar_info', parameterNames, {}, parameters)
  };
  /**
     * 单品详情API
     * https://www.haodanku.com/api/detail/show/16.html
     * @param {itemid} parameters 见API描述页
     */
  var item_detail = function (parameters) {
    var parameterNames = ['itemid'];
    return baseHaodanku('item_detail', parameterNames, {}, parameters)
  };
  /**
     * 超级搜索API
     * https://www.haodanku.com/api/detail/show/19.html
     * @param {*} parameters 见API描述页
     */
  var supersearch = function (parameters) {
    var parameterNames = ['keyword', 'back', 'min_id', 'tb_p', 'sort', 'is_tmall', 'is_coupon', 'limitrate', 'startprice'];
    return baseHaodanku('supersearch', parameterNames, {}, parameters)
  };
  /**
     * 超级分类API
     * https://www.haodanku.com/api/detail/show/9.html
     */
  var super_classify = function (parameters) {
    var parameterNames = [];
    return baseHaodanku('super_classify', parameterNames, {}, parameters)
  };
  /**
   * 商品筛选API
     * https://www.haodanku.com/api/detail/show/3.html
     * @param {*} parameters 见API描述页
     */
  var column = function (parameters) {
    var parameterNames = ['type', 'back', 'min_id', 'sort', 'cid', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'item_type'];
    return baseHaodanku('column', parameterNames, {}, parameters)
  };

  var haodanku = /*#__PURE__*/Object.freeze({
    __proto__: null,
    itemlist: itemlist,
    ratesurl: ratesurl,
    get_deserve_item: get_deserve_item,
    get_trill_data: get_trill_data,
    low_price_Pinkage_data: low_price_Pinkage_data,
    brandinfo: brandinfo,
    sales_list: sales_list,
    selected_item: selected_item,
    hot_key: hot_key,
    get_similar_info: get_similar_info,
    item_detail: item_detail,
    supersearch: supersearch,
    super_classify: super_classify,
    column: column
  });

  var rest = Object.assign(taofenxiang, { haodanku: haodanku });

  var HAODANKU_API_NAMES = ['itemlist', 'item_detail', 'supersearch', 'super_classify', 'column'];

  function createHaodankuState () {
    var s = {};
    HAODANKU_API_NAMES.forEach(function (e) {
      s[e] = { 'data': [], 'min_id': 1 };
    });
    return s
  }

  function createHaodankuApi () {
    var methods = {};
    HAODANKU_API_NAMES.forEach(function (e) {
      methods[e] = function (ref, parameters) {
        var commit = ref.commit;
        var state = ref.state;

        var parameterWithMinId = Object.assign({ min_id: state[e]['min_id'] }, parameters);
        rest['haodanku'][e].call(this, parameterWithMinId).then(function (res) {
          commit(e, res);
        });
      };
    });

    return methods
  }

  var mutations = {
    'itemlist': function itemlist (state, res) {
      var ref;

      (ref = state.itemlist.data).push.apply(ref, res.data);
      state.itemlist.min_id = res.min_id;
      console.log('modiy itemlist');
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
      state.super_classify.data = res.general_classify;
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
    state: createHaodankuState(),
    actions: createHaodankuApi(),
    mutations: mutations
  };

  Vue.use(Vuex);
  var store = new Vuex.Store({
    modules: {
      goods: goods
    }
  });

  function createDispatchFunction () {
    var methods = {};
    HAODANKU_API_NAMES.forEach(function (el) {
      methods[el] = function (parameters) {
        store.dispatch(("goods/" + el), parameters);
      };
    });
    return methods
  }
  function createStateDataFunction () {
    var methods = {};
    HAODANKU_API_NAMES.forEach(function (el) {
      methods[el + '_data'] = function () {
        return store.state['goods'][el]['data']
      };
    });
    return methods
  }

  var helpers = {
    goods: {
      actions: createDispatchFunction(),
      data: createStateDataFunction()
    }
  };

  var UserNotAuthorized = function UserNotAuthorized () {};

  function exportWxApi () {
    if (typeof (wx) !== 'undefined') {
      wxPromisePro.promisifyAll();

      return function () {
        var code = '';
        return wx.pro.login().then(function (res) {
          console.log('login res:', res);
          code = res.code;
          return wx.pro.getSetting()
        }).then(function (userSettings) {
          if (userSettings.authSetting['scope.userInfo']) {
            // 授权了
            return wx.pro.getUserInfo()
          } else {
            throw new UserNotAuthorized()
          }
        }).then(function (res) {
          console.log('从微信获取用户信息成功  ', res);
          var data = { code: code, encrypted_data: res.encryptedData, iv: res.iv, raw_data: res.rawData, signature: res.signature };
          return rest.wx.login(data)
        }).then(function (res) {
          console.log('登录API服务器成功', res);
          return rest.user.info()
        })
      }
    } else {
      return function () {}
    }
  }

  var getUserInfo = exportWxApi();

  var wx$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getUserInfo: getUserInfo
  });

  exports.UserNotAuthorized = UserNotAuthorized;
  exports.api = helpers;
  exports.config = config;
  exports.rest = rest;
  exports.store = store;
  exports.wxApi = wx$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
