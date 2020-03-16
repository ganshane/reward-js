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

class RestClient {
  constructor ({ isWx }) {
    if (isWx || typeof (wx) !== 'undefined') {
      const Fly = require('flyio/dist/npm/wx');
      this.fly = new Fly();
    } else {
      this.fly = require('flyio');
    }

    this.config = this.fly.config;
    this.interceptors = this.fly.interceptors;
    this.get = this.fly.get.bind(this.fly);
    this.post = this.fly.post.bind(this.fly);
  }
}

const FORM_DATA_HEADER = { headers: { 'content-type': 'application/x-www-form-urlencoded' }};

class Taofenxiang {
  fly () {
    if (this.flyInstance == null) { this.flyInstance = new RestClient(config); }
    return this.flyInstance
  }
  constructor () {
    this._post = (api, data) => {
      return this.fly().post(`${config.api}${api}`, data, FORM_DATA_HEADER).then(res => res.data)
    };
    this._get = (api, data) => { return this.fly().get(`${config.api}${api}`, data).then(res => res.data) };
    this.internalSetToken = (token) => { this.fly().config.headers = Object.assign(this.fly().config.headers, { 'Authorization': 'Bearer ' + token }); };
    this.public = {
      announces: () => this._get('/public/announces'),
      slides: () => this._get('/public/slides'),
      create_tpwd: ({ text, url, logo }) => this._post('/public/tpwd', { text, url, logo })
    };
    this.admin = {
      add_card: ({ no, secret, amount, created_id }) => this._post('/admin/card/add', { no, secret, amount, created_id }),
      cards: ({ page, size, sort }) => this._get('/admin/card/list', { page, size, sort }),

      add_slide: ({ img_url, url, status }) => this._post('/admin/slide/add', { img_url, url, status }),
      delete_slide: (id) => this._post('/admin/slide/delete', { id }),
      update_status: ({ id, status }) => this._post('/admin/slide/status', { id, status }),
      slides: () => this._get('/admin/slide/list'),

      add_announce: ({ content, url }) => this._post('/admin/announce/add', { content, url }),
      delete_announce: (id) => this._post('/admin/announce/delete', { id }),
      announces: () => this._get('/admin/announce/list'),
      users: ({ page, size, sort }) => this._get('/admin/users', { page, size, sort }),
      aliyun: {
        oss: () => this._get('/admin/aliyun/oss')
      }
    };
    this.consumption = {
      add: ({ amount, item_id, item_img, item_link }) => this._post('/consumption/add', { amount, item_id, item_img, item_link }),
      list: ({ page, size, sort }) => this._get('/consumption/list', { page, size, sort })
    };
    this.recharge = {
      add: ({ no, secret }) => this._post('/recharge/add', { no, secret }),
      list: ({ page, size, sort }) => this._get('/recharge/list', { page, size, sort })
    };
    this.user = {
      setToken: this.internalSetToken,
      clearToken: () => { delete this.fly().config.headers['Authorization']; },
      info: () => this._get('/user/info'),
      sendSms: (phone) => this._post('/user/sendSms', { phone }),
      login: ({ phone, code }) => {
        // 登录之前删除token
        this.user.clearToken();
        return this._post('/user/login', { phone, code }).then(data => {
          this.internalSetToken(data.token);
          return data
        })
      }
    };
    this.wx = {
      login: (data) => {
        return this._post('/wx/login', data)
          .then(data => {
            this.internalSetToken(data.token);
            return data
          })
      }
    };
  }
}

var taofenxiang = new Taofenxiang();

const FORM_DATA_HEADER$1 = { headers: { 'content-type': 'application/x-www-form-urlencoded' }};
class Haodanku {
  fly () {
    if (this.flyInstance == null) { this.flyInstance = new RestClient(config); }
    return this.flyInstance
  }
  baseHaodanku (apiName, parameterNames, defaultParameters, parameters) {
    const values = Object.assign(defaultParameters, parameters);
    let url = config.haodankuApi + '/' + apiName + '/apikey/' + config.haodankuKey;
    parameterNames.forEach(name => {
      if (values.hasOwnProperty(name)) { url += '/' + name + '/' + values[name]; }
    });
    return this.fly().get(url, {}, FORM_DATA_HEADER$1)
      .then(res => {
        const resData = (typeof (res.data) === 'string') ? JSON.parse(res.data) : res.data;
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
  itemlist (parameters) {
    const parameterNames = ['nav', 'cid', 'back', 'min_id', 'sort', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'tkrates_min', 'tkrates_max', 'tkmoney_min', 'item_type'];
    const defaultParameters = { nav: 3, cid: 0, back: 10, minId: 1 };
    return this.baseHaodanku('itemlist', parameterNames, defaultParameters, parameters)
  }

  /**
 * 高佣api调用
 * https://www.haodanku.com/api/detail/show/15.html
 * @param {itemid} parameters  商品id
 */
  ratesurl (parameters) {
    const defaultParameters = { 'apikey': config.haodankuKey, 'tb_name': config.haodanku_taobao_name, 'pid': config.taobaoke_pid };
    const values = Object.assign(defaultParameters, parameters);
    return this.fly().post(`${config.haodankuApi}/ratesurl`, values, FORM_DATA_HEADER$1)
      .then(res => {
        const resData = (typeof (res.data) === 'string') ? JSON.parse(res.data) : res.data;
        if (resData.code === 0) {
          console.error('抓取数据失败,msg:', resData.msg);
          throw new Error(resData.msg)
        } else {
          return resData
        }
      })
  }

  /**
 * 关键词商品页API
* https://www.haodanku.com/api/detail/show/5.html
*/
  get_keyword_items (parameters) {
    const parameterNames = ['keyword', 'shopid', 'back', 'sort', 'cid', 'min_id', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'type'];
    return this.baseHaodanku('get_keyword_items', parameterNames, {}, parameters)
  }
  /**
 * 今日值得买API
 * https://www.haodanku.com/api/detail/show/28.html
 */
  get_deserve_item () {
    const parameterNames = [];
    return this.baseHaodanku('get_deserve_item', parameterNames, {}, {})
  }
  /**
 * 抖货商品API
 * https://www.haodanku.com/api/detail/show/32.html
 * @param {min_id,cat_id,order,back} parameters itemid
 */
  get_trill_data (parameters) {
    const parameterNames = ['min_id', 'cat_id', 'order', 'back'];
    return this.baseHaodanku('get_trill_data', parameterNames, {}, parameters)
  }
  /**
 * 精选低价包邮专区API
 * https://www.haodanku.com/api/detail/show/36.html
 * @param {min_id, order, type} parameters itemid
 */
  low_price_Pinkage_data (parameters) {
    const parameterNames = ['min_id', 'order', 'type'];
    return this.baseHaodanku('low_price_Pinkage_data', parameterNames, {}, parameters)
  }
  /**
 * 品牌列表API
 * https://www.haodanku.com/api/detail/show/31.html
 * @param {min_id, back, brandcat} parameters itemid
 */
  brandinfo (parameters) {
    const parameterNames = ['min_id', 'back', 'brandcat'];
    return this.baseHaodanku('brandinfo', parameterNames, {}, parameters)
  }
  /**
 * 各大榜单API
 * https://www.haodanku.com/api/detail/show/29.html
 * @param {sale_type, min_id, cid, back, item_type} parameters itemid
 */
  sales_list (parameters) {
    const parameterNames = ['sale_type', 'min_id', 'cid', 'back', 'item_type'];
    return this.baseHaodanku('sales_list', parameterNames, {}, parameters)
  }
  /**
 * 朋友圈API
 * https://www.haodanku.com/api/detail/show/23.html
 * @param {min_id} parameters itemid
 */
  selected_item (parameters) {
    const parameterNames = ['min_id'];
    return this.baseHaodanku('selected_item', parameterNames, {}, parameters)
  }
  /**
 * 热搜关键词记录API
 * https://www.haodanku.com/api/detail/show/6.html
 */
  hot_key () {
    const parameterNames = [];
    return this.baseHaodanku('hot_key', parameterNames, {}, {})
  }
  /**
 * 猜你喜欢API
 * https://www.haodanku.com/api/detail/show/17.html
 * @param {itemid} parameters itemid
 */
  get_similar_info (parameters) {
    const parameterNames = ['itemid'];
    return this.baseHaodanku('get_similar_info', parameterNames, {}, parameters)
  }
  /**
   * 单品详情API
   * https://www.haodanku.com/api/detail/show/16.html
   * @param {itemid} parameters 见API描述页
   */
  item_detail (parameters) {
    const parameterNames = ['itemid'];
    return this.baseHaodanku('item_detail', parameterNames, {}, parameters)
  }
  /**
   * 超级搜索API
   * https://www.haodanku.com/api/detail/show/19.html
   * @param {*} parameters 见API描述页
   */
  supersearch (parameters) {
    const parameterNames = ['keyword', 'back', 'min_id', 'tb_p', 'sort', 'is_tmall', 'is_coupon', 'limitrate', 'startprice'];
    return this.baseHaodanku('supersearch', parameterNames, {}, parameters)
  }
  /**
   * 超级分类API
   * https://www.haodanku.com/api/detail/show/9.html
   */
  super_classify (parameters) {
    const parameterNames = [];
    return this.baseHaodanku('super_classify', parameterNames, {}, parameters)
  }
  /**
 * 商品筛选API
   * https://www.haodanku.com/api/detail/show/3.html
   * @param {*} parameters 见API描述页
   */
  column (parameters) {
    const parameterNames = ['type', 'back', 'min_id', 'sort', 'cid', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'item_type'];
    return this.baseHaodanku('column', parameterNames, {}, parameters)
  }
}
var haodanku = new Haodanku();

const rest = Object.assign(taofenxiang, { haodanku });

const HAODANKU_API_NAMES = ['itemlist', 'item_detail', 'supersearch', 'super_classify', 'column'];

function createHaodankuState () {
  const s = {};
  HAODANKU_API_NAMES.forEach(e => {
    s[e] = { 'data': [], 'min_id': 1 };
  });
  return s
}

function createHaodankuApi () {
  const methods = {};
  HAODANKU_API_NAMES.forEach(e => {
    methods[e] = function ({ commit, state }, parameters) {
      const parameterWithMinId = Object.assign({ min_id: state[e]['min_id'] }, parameters);
      rest['haodanku'][e](parameterWithMinId).then(res => {
        commit(e, res);
      });
    };
  });

  return methods
}

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
    state.super_classify.data = res.general_classify;
    // state.super_classify.min_id = res.min_id
  },
  'column' (state, res) {
    state.column.data.push(...res.data);
    state.column.min_id = res.min_id;
  }
};

var goods = {
  namespaced: true,
  state: createHaodankuState(),
  actions: createHaodankuApi(),
  mutations
};

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    goods
  }
});

function createDispatchFunction () {
  const methods = {};
  HAODANKU_API_NAMES.forEach(el => {
    methods[el] = function (parameters) {
      store.dispatch(`goods/${el}`, parameters);
    };
  });
  return methods
}
function createStateDataFunction () {
  const methods = {};
  HAODANKU_API_NAMES.forEach(el => {
    methods[el + '_data'] = function () {
      return store.state['goods'][el]['data']
    };
  });
  return methods
}

const helpers = {
  goods: {
    actions: createDispatchFunction(),
    data: createStateDataFunction()
  }
};

class UserNotAuthorized {}

function exportWxApi () {
  if (typeof (wx) !== 'undefined') {
    promisifyAll();

    return () => {
      let code = '';
      return wx.pro.login().then(res => {
        console.log('login res:', res);
        code = res.code;
        return wx.pro.getSetting()
      }).then(userSettings => {
        if (userSettings.authSetting['scope.userInfo']) {
          // 授权了
          return wx.pro.getUserInfo()
        } else {
          throw new UserNotAuthorized()
        }
      }).then(res => {
        console.log('从微信获取用户信息成功  ', res);
        const data = { code, encrypted_data: res.encryptedData, iv: res.iv, raw_data: res.rawData, signature: res.signature };
        return rest.wx.login(data)
      }).then(res => {
        console.log('登录API服务器成功', res);
        return rest.user.info()
      })
    }
  } else {
    return () => {}
  }
}

const getUserInfo = exportWxApi();

var wxApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getUserInfo: getUserInfo
});

var index_esm = {
  version: '1.0.32',
  config,
  store,
  api: helpers,
  wxApi,
  rest
};

export default index_esm;
export { UserNotAuthorized, helpers as api, config, rest, store, wxApi };
