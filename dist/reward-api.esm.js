/**
 * reward-api v1.0.32
 * (c) 2020 Jun Tsai
 * @license Apache-2.0
 */
import Vue from 'vue';
import Vuex from 'vuex';
import { promisifyAll } from 'wx-promise-pro';

var config = {
  haodankuApi: 'https://v2.api.haodanku.com',
  haodankuKey: 'gofanli',
  haodanku_taobao_name: 'zhyj_cn',
  taobaoke_pid: 'mm_19052242_1281300405_110017350452',
  api: 'https://api.gofanli.cn',
  isWx: false
};

var RestClient = function RestClient (ref) {
  var isWx = ref.isWx;

  if (isWx || typeof (wx) !== 'undefined') {
    var Fly = require('flyio/dist/npm/wx');
    this.fly = new Fly();
  } else {
    this.fly = require('flyio');
  }

  this.config = this.fly.config;
  this.interceptors = this.fly.interceptors;
  this.get = this.fly.get.bind(this.fly);
  this.post = this.fly.post.bind(this.fly);
};

var FORM_DATA_HEADER = { headers: { 'content-type': 'application/x-www-form-urlencoded' }};

var Taofenxiang = function Taofenxiang () {
  var this$1 = this;

  this._post = function (api, data) {
    return this$1.fly().post(("" + (config.api) + api), data, FORM_DATA_HEADER).then(function (res) { return res.data; })
  };
  this._get = function (api, data) { return this$1.fly().get(("" + (config.api) + api), data).then(function (res) { return res.data; }) };
  this.internalSetToken = function (token) { this$1.fly().config.headers = Object.assign(this$1.fly().config.headers, { 'Authorization': 'Bearer ' + token }); };
  this.public = {
    announces: function () { return this$1._get('/public/announces'); },
    slides: function () { return this$1._get('/public/slides'); },
    create_tpwd: function (ref) {
      var text = ref.text;
      var url = ref.url;
      var logo = ref.logo;

      return this$1._post('/public/tpwd', { text: text, url: url, logo: logo });
  }
  };
  this.admin = {
    add_card: function (ref) {
      var no = ref.no;
      var secret = ref.secret;
      var amount = ref.amount;
      var created_id = ref.created_id;

      return this$1._post('/admin/card/add', { no: no, secret: secret, amount: amount, created_id: created_id });
  },
    cards: function (ref) {
      var page = ref.page;
      var size = ref.size;
      var sort = ref.sort;

      return this$1._get('/admin/card/list', { page: page, size: size, sort: sort });
  },

    add_slide: function (ref) {
      var img_url = ref.img_url;
      var url = ref.url;
      var status = ref.status;

      return this$1._post('/admin/slide/add', { img_url: img_url, url: url, status: status });
  },
    delete_slide: function (id) { return this$1._post('/admin/slide/delete', { id: id }); },
    update_status: function (ref) {
      var id = ref.id;
      var status = ref.status;

      return this$1._post('/admin/slide/status', { id: id, status: status });
  },
    slides: function () { return this$1._get('/admin/slide/list'); },

    add_announce: function (ref) {
      var content = ref.content;
      var url = ref.url;

      return this$1._post('/admin/announce/add', { content: content, url: url });
  },
    delete_announce: function (id) { return this$1._post('/admin/announce/delete', { id: id }); },
    announces: function () { return this$1._get('/admin/announce/list'); },
    users: function (ref) {
      var page = ref.page;
      var size = ref.size;
      var sort = ref.sort;

      return this$1._get('/admin/users', { page: page, size: size, sort: sort });
  },
    aliyun: {
      oss: function () { return this$1._get('/admin/aliyun/oss'); }
    }
  };
  this.consumption = {
    add: function (ref) {
      var amount = ref.amount;
      var item_id = ref.item_id;
      var item_img = ref.item_img;
      var item_link = ref.item_link;

      return this$1._post('/consumption/add', { amount: amount, item_id: item_id, item_img: item_img, item_link: item_link });
  },
    list: function (ref) {
      var page = ref.page;
      var size = ref.size;
      var sort = ref.sort;

      return this$1._get('/consumption/list', { page: page, size: size, sort: sort });
  }
  };
  this.recharge = {
    add: function (ref) {
      var no = ref.no;
      var secret = ref.secret;

      return this$1._post('/recharge/add', { no: no, secret: secret });
  },
    list: function (ref) {
      var page = ref.page;
      var size = ref.size;
      var sort = ref.sort;

      return this$1._get('/recharge/list', { page: page, size: size, sort: sort });
  }
  };
  this.user = {
    setToken: this.internalSetToken,
    clearToken: function () { delete this$1.fly().config.headers['Authorization']; },
    info: function () { return this$1._get('/user/info'); },
    sendSms: function (phone) { return this$1._post('/user/sendSms', { phone: phone }); },
    login: function (ref) {
      var phone = ref.phone;
      var code = ref.code;

      // 登录之前删除token
      this$1.user.clearToken();
      return this$1._post('/user/login', { phone: phone, code: code }).then(function (data) {
        this$1.internalSetToken(data.token);
        return data
      })
    }
  };
  this.wx = {
    login: function (data) {
      return this$1._post('/wx/login', data)
        .then(function (data) {
          this$1.internalSetToken(data.token);
          return data
        })
    }
  };
};

Taofenxiang.prototype.fly = function fly () {
  if (this.flyInstance == null) { this.flyInstance = new RestClient(config); }
  return this.flyInstance
};

var taofenxiang = new Taofenxiang();

var FORM_DATA_HEADER$1 = { headers: { 'content-type': 'application/x-www-form-urlencoded' }};
var Haodanku = function Haodanku () {};

Haodanku.prototype.fly = function fly () {
  if (this.flyInstance == null) { this.flyInstance = new RestClient(config); }
  return this.flyInstance
};
Haodanku.prototype.baseHaodanku = function baseHaodanku (apiName, parameterNames, defaultParameters, parameters) {
  var values = Object.assign(defaultParameters, parameters);
  var url = config.haodankuApi + '/' + apiName + '/apikey/' + config.haodankuKey;
  parameterNames.forEach(function (name) {
    if (values.hasOwnProperty(name)) { url += '/' + name + '/' + values[name]; }
  });
  return this.fly().get(url, {}, FORM_DATA_HEADER$1)
    .then(function (res) {
      var resData = (typeof (res.data) === 'string') ? JSON.parse(res.data) : res.data;
      if (resData.code === 0) {
        console.error('抓取数据失败,服务器消息:', resData.msg);
        throw new Error(resData.msg)
      } else {
        return resData
      }
    })
};

/**
 * 商品列表页API
 * https://www.haodanku.com/api/detail/show/1.html
 * @param {*} parameters 见API描述页
 */
Haodanku.prototype.itemlist = function itemlist (parameters) {
  var parameterNames = ['nav', 'cid', 'back', 'min_id', 'sort', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'tkrates_min', 'tkrates_max', 'tkmoney_min', 'item_type'];
  var defaultParameters = { nav: 3, cid: 0, back: 10, minId: 1 };
  return this.baseHaodanku('itemlist', parameterNames, defaultParameters, parameters)
};

/**
 * 高佣api调用
 * https://www.haodanku.com/api/detail/show/15.html
 * @param {itemid} parameters商品id
 */
Haodanku.prototype.ratesurl = function ratesurl (parameters) {
  var defaultParameters = { 'apikey': config.haodankuKey, 'tb_name': config.haodanku_taobao_name, 'pid': config.taobaoke_pid };
  var values = Object.assign(defaultParameters, parameters);
  return this.fly().post(((config.haodankuApi) + "/ratesurl"), values, FORM_DATA_HEADER$1)
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
 * 关键词商品页API
* https://www.haodanku.com/api/detail/show/5.html
*/
Haodanku.prototype.get_keyword_items = function get_keyword_items (parameters) {
  var parameterNames = ['keyword', 'shopid', 'back', 'sort', 'cid', 'min_id', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'type'];
  return this.baseHaodanku('get_keyword_items', parameterNames, {}, parameters)
};
/**
 * 今日值得买API
 * https://www.haodanku.com/api/detail/show/28.html
 */
Haodanku.prototype.get_deserve_item = function get_deserve_item () {
  var parameterNames = [];
  return this.baseHaodanku('get_deserve_item', parameterNames, {}, {})
};
/**
 * 抖货商品API
 * https://www.haodanku.com/api/detail/show/32.html
 * @param {min_id,cat_id,order,back} parameters itemid
 */
Haodanku.prototype.get_trill_data = function get_trill_data (parameters) {
  var parameterNames = ['min_id', 'cat_id', 'order', 'back'];
  return this.baseHaodanku('get_trill_data', parameterNames, {}, parameters)
};
/**
 * 精选低价包邮专区API
 * https://www.haodanku.com/api/detail/show/36.html
 * @param {min_id, order, type} parameters itemid
 */
Haodanku.prototype.low_price_Pinkage_data = function low_price_Pinkage_data (parameters) {
  var parameterNames = ['min_id', 'order', 'type'];
  return this.baseHaodanku('low_price_Pinkage_data', parameterNames, {}, parameters)
};
/**
 * 品牌列表API
 * https://www.haodanku.com/api/detail/show/31.html
 * @param {min_id, back, brandcat} parameters itemid
 */
Haodanku.prototype.brandinfo = function brandinfo (parameters) {
  var parameterNames = ['min_id', 'back', 'brandcat'];
  return this.baseHaodanku('brandinfo', parameterNames, {}, parameters)
};
/**
 * 各大榜单API
 * https://www.haodanku.com/api/detail/show/29.html
 * @param {sale_type, min_id, cid, back, item_type} parameters itemid
 */
Haodanku.prototype.sales_list = function sales_list (parameters) {
  var parameterNames = ['sale_type', 'min_id', 'cid', 'back', 'item_type'];
  return this.baseHaodanku('sales_list', parameterNames, {}, parameters)
};
/**
 * 朋友圈API
 * https://www.haodanku.com/api/detail/show/23.html
 * @param {min_id} parameters itemid
 */
Haodanku.prototype.selected_item = function selected_item (parameters) {
  var parameterNames = ['min_id'];
  return this.baseHaodanku('selected_item', parameterNames, {}, parameters)
};
/**
 * 热搜关键词记录API
 * https://www.haodanku.com/api/detail/show/6.html
 */
Haodanku.prototype.hot_key = function hot_key () {
  var parameterNames = [];
  return this.baseHaodanku('hot_key', parameterNames, {}, {})
};
/**
 * 猜你喜欢API
 * https://www.haodanku.com/api/detail/show/17.html
 * @param {itemid} parameters itemid
 */
Haodanku.prototype.get_similar_info = function get_similar_info (parameters) {
  var parameterNames = ['itemid'];
  return this.baseHaodanku('get_similar_info', parameterNames, {}, parameters)
};
/**
 * 单品详情API
 * https://www.haodanku.com/api/detail/show/16.html
 * @param {itemid} parameters 见API描述页
 */
Haodanku.prototype.item_detail = function item_detail (parameters) {
  var parameterNames = ['itemid'];
  return this.baseHaodanku('item_detail', parameterNames, {}, parameters)
};
/**
 * 超级搜索API
 * https://www.haodanku.com/api/detail/show/19.html
 * @param {*} parameters 见API描述页
 */
Haodanku.prototype.supersearch = function supersearch (parameters) {
  var parameterNames = ['keyword', 'back', 'min_id', 'tb_p', 'sort', 'is_tmall', 'is_coupon', 'limitrate', 'startprice'];
  return this.baseHaodanku('supersearch', parameterNames, {}, parameters)
};
/**
 * 超级分类API
 * https://www.haodanku.com/api/detail/show/9.html
 */
Haodanku.prototype.super_classify = function super_classify (parameters) {
  var parameterNames = [];
  return this.baseHaodanku('super_classify', parameterNames, {}, parameters)
};
/**
 * 商品筛选API
 * https://www.haodanku.com/api/detail/show/3.html
 * @param {*} parameters 见API描述页
 */
Haodanku.prototype.column = function column (parameters) {
  var parameterNames = ['type', 'back', 'min_id', 'sort', 'cid', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'item_type'];
  return this.baseHaodanku('column', parameterNames, {}, parameters)
};
var haodanku = new Haodanku();

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
      rest['haodanku'][e](parameterWithMinId).then(function (res) {
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
    promisifyAll();

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

var wxApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getUserInfo: getUserInfo
});

var index_esm = {
  version: '1.0.32',
  config: config,
  store: store,
  api: helpers,
  wxApi: wxApi,
  rest: rest
};

export default index_esm;
export { UserNotAuthorized, helpers as api, config, rest, store, wxApi };
