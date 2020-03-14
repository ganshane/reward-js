import config from '../config'
import fly from './net'

const FORM_DATA_HEADER = { headers: { 'content-type': 'application/x-www-form-urlencoded' }}
function baseHaodanku (apiName, parameterNames, defaultParameters, parameters) {
  const values = Object.assign(defaultParameters, parameters)
  let url = config.haodankuApi + '/' + apiName + '/apikey/' + config.haodankuKey
  parameterNames.forEach(name => {
    if (values[name] !== undefined) url += '/' + name + '/' + values[name]
  })
  return fly.get(url, {}, FORM_DATA_HEADER)
    .then(res => {
      const resData = (typeof (res.data) === 'string') ? JSON.parse(res.data) : res.data
      if (resData.code === 0) {
        console.error('抓取数据失败,服务器消息:', resData.msg)
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
export const itemlist = (parameters) => {
  const parameterNames = ['nav', 'cid', 'back', 'min_id', 'sort', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'tkrates_min', 'tkrates_max', 'tkmoney_min', 'item_type']
  const defaultParameters = { nav: 3, cid: 0, back: 10, minId: 1 }
  return baseHaodanku('itemlist', parameterNames, defaultParameters, parameters)
}

/**
 * 高佣api调用
 * https://www.haodanku.com/api/detail/show/15.html
 * @param {itemid} parameters  商品id
 */
export const ratesurl = (parameters) => {
  const defaultParameters = { 'apikey': config.haodankuKey, 'tb_name': config.haodanku_taobao_name, 'pid': config.taobaoke_pid }
  const values = Object.assign(defaultParameters, parameters)
  return fly.post(`${config.haodanku_taobao_name}/ratesurl`, values, FORM_DATA_HEADER)
    .then(res => {
      const resData = (typeof (res.data) === 'string') ? JSON.parse(res.data) : res.data
      if (resData.code === 0) {
        console.error('抓取数据失败,msg:', resData.msg)
        throw new Error(resData.msg)
      } else {
        return resData
      }
    })
}

/**
 * https://www.haodanku.com/api/detail/show/31.html
 * @param {itemid} parameters itemid
 */
export const brandinfo = (parameters) => {
  const parameterNames = ['min_id', 'back', 'brandcat']
  return baseHaodanku('brandinfo', parameterNames, {}, parameters)
}
/**
 * https://www.haodanku.com/api/detail/show/29.html
 * @param {itemid} parameters itemid
 */
export const sales_list = (parameters) => {
  const parameterNames = ['sale_type', 'min_id', 'cid', 'back', 'item_type']
  return baseHaodanku('sales_list', parameterNames, {}, parameters)
}
/**
 * https://www.haodanku.com/api/detail/show/23.html
 * @param {itemid} parameters itemid
 */
export const selected_item = (parameters) => {
  const parameterNames = ['min_id']
  return baseHaodanku('selected_item', parameterNames, {}, parameters)
}
/**
 * https://www.haodanku.com/api/detail/show/17.html
 * @param {itemid} parameters itemid
 */
export const hot_key = () => {
  const parameterNames = []
  return baseHaodanku('hot_key', parameterNames, {}, {})
}
/**
 * https://www.haodanku.com/api/detail/show/17.html
 * @param {itemid} parameters itemid
 */
export const get_similar_info = (parameters) => {
  const parameterNames = ['itemid']
  return baseHaodanku('get_similar_info', parameterNames, {}, parameters)
}
/**
   * 单品详情API
   * https://www.haodanku.com/api/detail/show/16.html
   * @param {*} parameters 见API描述页
   */
export const item_detail = (parameters) => {
  const parameterNames = ['itemid']
  return baseHaodanku('item_detail', parameterNames, {}, parameters)
}
/**
   * 超级搜索API
   * https://www.haodanku.com/api/detail/show/19.html
   * @param {*} parameters 见API描述页
   */
export const supersearch = (parameters) => {
  const parameterNames = ['keyword', 'back', 'min_id', 'tb_p', 'sort', 'is_tmall', 'is_coupon', 'limitrate', 'startprice']
  return baseHaodanku('supersearch', parameterNames, {}, parameters)
}
/**
   * 超级分类API
   * https://www.haodanku.com/api/detail/show/9.html
   * @param {*} parameters 见API描述页
   */
export const super_classify = (parameters) => {
  const parameterNames = []
  return baseHaodanku('super_classify', parameterNames, {}, parameters)
}
/**
   * 超级分类API
   * https://www.haodanku.com/api/detail/show/9.html
   * @param {*} parameters 见API描述页
   */
export const column = (parameters) => {
  const parameterNames = ['type', 'back', 'min_id', 'sort', 'cid', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'item_type']
  return baseHaodanku('column', parameterNames, {}, parameters)
}
