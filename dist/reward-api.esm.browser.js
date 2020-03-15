/**
 * reward-api v1.0.26
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

function createFlyInstance () {
  if (config.isWx || typeof (wx) !== 'undefined') {
    const Fly = require('flyio/dist/npm/wx');
    return new Fly()
  } else {
    return require('flyio')
  }
}

const fly = createFlyInstance();

const FORM_DATA_HEADER = { headers: { 'content-type': 'application/x-www-form-urlencoded' }};

const postApi = (api, data) => {
  return fly.post(`${config.api}${api}`, data, FORM_DATA_HEADER).then(res => res.data)
};
const getApi = (api, data) => fly.get(`${config.api}${api}`, data).then(res => res.data);
const internalSetToken = (token) => { fly.config.headers = Object.assign(fly.config.headers, { 'Authorization': 'Bearer ' + token }); };
var taofenxiang = {
  public: {
    announces: () => getApi('/public/announces'),
    slides: () => getApi('/public/slides')
  },
  admin: {
    add_card: ({ no, secret, amount, created_id }) => postApi('/admin/card/add', { no, secret, amount, created_id }),
    cards: ({ page, size, sort }) => postApi('/admin/card/list', { page, size, sort }),

    add_slide: ({ img_url, url, status }) => postApi('/admin/slide/add', { img_url, url, status }),
    delete_slide: (id) => postApi('/admin/slide/delete', { id }),
    update_status: ({ id, status }) => postApi('/admin/slide/status', { id, status }),
    slides: () => getApi('/admin/slide/list'),

    add_announce: ({ content, url }) => postApi('/admin/announce/add', { content, url }),
    delete_announce: (id) => postApi('/admin/announce/delete', { id }),
    announces: () => getApi('/admin/announce/list'),
    users: ({ page, size, sort }) => postApi('/admin/users', { page, size, sort })
  },
  consumption: {
    add: ({ amount, item_id, item_img, item_link }) => postApi('/consumption/add', { amount, item_id, item_img, item_link }),
    list: ({ page, size, sort }) => postApi('/consumption/list', { page, size, sort })
  },
  recharge: {
    add: ({ no, secret }) => postApi('/recharge/add', { no, secret }),
    list: ({ page, size, sort }) => postApi('/recharge/list', { page, size, sort })
  },
  user: {
    setToken: internalSetToken,
    clearToken: () => { delete fly.config.headers['Authorization']; },
    info: () => getApi('/user/info'),
    sendSms: (phone) => postApi('/user/sendSms', { phone }),
    login: ({ phone, code }) => {
      return postApi('/user/login', { phone, code }).then(data => {
        internalSetToken(data.token);
        return data
      })
    }
  },
  wx: {
    login: (data) => {
      return postApi('/wx/login', data)
        .then(data => {
          internalSetToken(data.token);
          return data
        })
    }
  }
};

// remove Authorization header
fly.interceptors.request.use((request) => {
  if (request.url.indexOf('haodanku.com') > 0) {
    delete request.headers['Authorization'];
  }
});

const FORM_DATA_HEADER$1 = { headers: { 'content-type': 'application/x-www-form-urlencoded' }};
function baseHaodanku (apiName, parameterNames, defaultParameters, parameters) {
  const values = Object.assign(defaultParameters, parameters);
  let url = config.haodankuApi + '/' + apiName + '/apikey/' + config.haodankuKey;
  parameterNames.forEach(name => {
    if (values.hasOwnProperty(name)) { url += '/' + name + '/' + values[name]; }
  });
  return fly.get(url, {}, FORM_DATA_HEADER$1)
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
const itemlist = (parameters) => {
  const parameterNames = ['nav', 'cid', 'back', 'min_id', 'sort', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'tkrates_min', 'tkrates_max', 'tkmoney_min', 'item_type'];
  const defaultParameters = { nav: 3, cid: 0, back: 10, minId: 1 };
  return baseHaodanku('itemlist', parameterNames, defaultParameters, parameters)
};

/**
 * 高佣api调用
 * https://www.haodanku.com/api/detail/show/15.html
 * @param {itemid} parameters  商品id
 */
const ratesurl = (parameters) => {
  const defaultParameters = { 'apikey': config.haodankuKey, 'tb_name': config.haodanku_taobao_name, 'pid': config.taobaoke_pid };
  const values = Object.assign(defaultParameters, parameters);
  return fly.post(`${config.haodanku_taobao_name}/ratesurl`, values, FORM_DATA_HEADER$1)
    .then(res => {
      const resData = (typeof (res.data) === 'string') ? JSON.parse(res.data) : res.data;
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
const get_deserve_item = () => {
  const parameterNames = [];
  return baseHaodanku('get_deserve_item', parameterNames, {}, {})
};
/**
 * 抖货商品API
 * https://www.haodanku.com/api/detail/show/32.html
 * @param {min_id,cat_id,order,back} parameters itemid
 */
const get_trill_data = (parameters) => {
  const parameterNames = ['min_id', 'cat_id', 'order', 'back'];
  return baseHaodanku('get_trill_data', parameterNames, {}, parameters)
};
/**
 * 精选低价包邮专区API
 * https://www.haodanku.com/api/detail/show/36.html
 * @param {min_id, order, type} parameters itemid
 */
const low_price_Pinkage_data = (parameters) => {
  const parameterNames = ['min_id', 'order', 'type'];
  return baseHaodanku('low_price_Pinkage_data', parameterNames, {}, parameters)
};
/**
 * 品牌列表API
 * https://www.haodanku.com/api/detail/show/31.html
 * @param {min_id, back, brandcat} parameters itemid
 */
const brandinfo = (parameters) => {
  const parameterNames = ['min_id', 'back', 'brandcat'];
  return baseHaodanku('brandinfo', parameterNames, {}, parameters)
};
/**
 * 各大榜单API
 * https://www.haodanku.com/api/detail/show/29.html
 * @param {sale_type, min_id, cid, back, item_type} parameters itemid
 */
const sales_list = (parameters) => {
  const parameterNames = ['sale_type', 'min_id', 'cid', 'back', 'item_type'];
  return baseHaodanku('sales_list', parameterNames, {}, parameters)
};
/**
 * 朋友圈API
 * https://www.haodanku.com/api/detail/show/23.html
 * @param {min_id} parameters itemid
 */
const selected_item = (parameters) => {
  const parameterNames = ['min_id'];
  return baseHaodanku('selected_item', parameterNames, {}, parameters)
};
/**
 * 热搜关键词记录API
 * https://www.haodanku.com/api/detail/show/6.html
 */
const hot_key = () => {
  const parameterNames = [];
  return baseHaodanku('hot_key', parameterNames, {}, {})
};
/**
 * 猜你喜欢API
 * https://www.haodanku.com/api/detail/show/17.html
 * @param {itemid} parameters itemid
 */
const get_similar_info = (parameters) => {
  const parameterNames = ['itemid'];
  return baseHaodanku('get_similar_info', parameterNames, {}, parameters)
};
/**
   * 单品详情API
   * https://www.haodanku.com/api/detail/show/16.html
   * @param {itemid} parameters 见API描述页
   */
const item_detail = (parameters) => {
  const parameterNames = ['itemid'];
  return baseHaodanku('item_detail', parameterNames, {}, parameters)
};
/**
   * 超级搜索API
   * https://www.haodanku.com/api/detail/show/19.html
   * @param {*} parameters 见API描述页
   */
const supersearch = (parameters) => {
  const parameterNames = ['keyword', 'back', 'min_id', 'tb_p', 'sort', 'is_tmall', 'is_coupon', 'limitrate', 'startprice'];
  return baseHaodanku('supersearch', parameterNames, {}, parameters)
};
/**
   * 超级分类API
   * https://www.haodanku.com/api/detail/show/9.html
   */
const super_classify = (parameters) => {
  const parameterNames = [];
  return baseHaodanku('super_classify', parameterNames, {}, parameters)
};
/**
 * 商品筛选API
   * https://www.haodanku.com/api/detail/show/3.html
   * @param {*} parameters 见API描述页
   */
const column = (parameters) => {
  const parameterNames = ['type', 'back', 'min_id', 'sort', 'cid', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'item_type'];
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
      rest['haodanku'][e].call(this, parameterWithMinId).then(res => {
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
    console.log('modiy itemlist');
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
  version: '1.0.26',
  config,
  store,
  api: helpers,
  wxApi,
  rest
};

export default index_esm;
export { UserNotAuthorized, helpers as api, config, rest, store, wxApi };
