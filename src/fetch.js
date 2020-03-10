import fly from 'flyio'
import config from './config'

fly.config.headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
}

const baseHaodanku = function (apiName, parameterNames, defaultParameters, parameters) {
  const values = Object.assign(defaultParameters, parameters)
  let url = config.haodankuApi + '/' + apiName + '/apikey/' + config.haodankuKey
  parameterNames.forEach(name => {
    if (values[name] !== undefined) url += '/' + name + '/' + values[name]
  })
  return fly.get(url)
    .then(res => {
      return JSON.parse(res.data)
    })
}
export default {
  /**
   * 商品列表页API
   * https://www.haodanku.com/api/detail/show/1.html
   * @param {*} parameters 见API描述页
   */
  itemlist (parameters) {
    const parameterNames = ['nav', 'cid', 'back', 'min_id', 'sort', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'tkrates_min', 'tkrates_max', 'tkmoney_min', 'item_type']
    const defaultParameters = { nav: 3, cid: 0, back: 10, minId: 1 }
    return baseHaodanku('itemlist', parameterNames, defaultParameters, parameters)
  },
  /**
   * 单品详情API
   * https://www.haodanku.com/api/detail/show/16.html
   * @param {*} parameters 见API描述页
   */
  item_detail (parameters) {
    const parameterNames = ['itemid']
    return baseHaodanku('item_detail', parameterNames, {}, parameters)
  },
  /**
   * 超级搜索API
   * https://www.haodanku.com/api/detail/show/19.html
   * @param {*} parameters 见API描述页
   */
  supersearch (parameters) {
    const parameterNames = ['keyword', 'back', 'min_id', 'tb_p', 'sort', 'is_tmall', 'is_coupon', 'limitrate', 'startprice']
    return baseHaodanku('supersearch', parameterNames, {}, parameters)
  },
  /**
   * 超级分类API
   * https://www.haodanku.com/api/detail/show/9.html
   * @param {*} parameters 见API描述页
   */
  super_classify (parameters) {
    const parameterNames = []
    return baseHaodanku('super_classify', parameterNames, {}, parameters)
  },
  /**
   * 超级分类API
   * https://www.haodanku.com/api/detail/show/9.html
   * @param {*} parameters 见API描述页
   */
  column (parameters) {
    const parameterNames = ['type', 'back', 'min_id', 'sort', 'cid', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'item_type']
    return baseHaodanku('column', parameterNames, {}, parameters)
  }
}
