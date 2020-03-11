
import config from './config'

function createFlyInstance () {
  if (config.isWx || typeof (wx) !== 'undefined') {
    const Fly = require('flyio/dist/npm/wx')
    return new Fly()
  } else {
    return require('flyio')
  }
}

const fly = createFlyInstance()

fly.config.headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
}

function baseHaodanku (apiName, parameterNames, defaultParameters, parameters) {
  const values = Object.assign(defaultParameters, parameters)
  let url = config.haodankuApi + '/' + apiName + '/apikey/' + config.haodankuKey
  parameterNames.forEach(name => {
    if (values[name] !== undefined) url += '/' + name + '/' + values[name]
  })
  return fly.get(url)
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
