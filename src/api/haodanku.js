import config from '../config'
import RestClient from './net'

const FORM_DATA_HEADER = { headers: { 'content-type': 'application/x-www-form-urlencoded' }}
class Haodanku {
  fly () {
    if (this.flyInstance == null) { this.flyInstance = new RestClient(config) }
    return this.flyInstance
  }
  baseHaodanku (apiName, parameterNames, defaultParameters, parameters) {
    const values = Object.assign(defaultParameters, parameters)
    let url = config.haodankuApi + '/' + apiName + '/apikey/' + config.haodankuKey
    parameterNames.forEach(name => {
      if (values.hasOwnProperty(name)) { url += '/' + name + '/' + values[name] }
    })
    return this.fly().get(url, {}, FORM_DATA_HEADER)
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
  itemlist (parameters) {
    const parameterNames = ['nav', 'cid', 'back', 'min_id', 'sort', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'tkrates_min', 'tkrates_max', 'tkmoney_min', 'item_type']
    const defaultParameters = { nav: 3, cid: 0, back: 10, minId: 1 }
    return this.baseHaodanku('itemlist', parameterNames, defaultParameters, parameters)
  }

  /**
 * 高佣api调用
 * https://www.haodanku.com/api/detail/show/15.html
 * @param {itemid} parameters  商品id
 */
  ratesurl (parameters) {
    const defaultParameters = { 'apikey': config.haodankuKey, 'tb_name': config.haodanku_taobao_name, 'pid': config.taobaoke_pid }
    const values = Object.assign(defaultParameters, parameters)
    return this.fly().post(`${config.haodankuApi}/ratesurl`, values, FORM_DATA_HEADER)
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
 * 关键词商品页API
* https://www.haodanku.com/api/detail/show/5.html
*/
  get_keyword_items (parameters) {
    const parameterNames = ['keyword', 'shopid', 'back', 'sort', 'cid', 'min_id', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'type']
    return this.baseHaodanku('get_keyword_items', parameterNames, {}, parameters)
  }
  /**
 * 今日值得买API
 * https://www.haodanku.com/api/detail/show/28.html
 */
  get_deserve_item () {
    const parameterNames = []
    return this.baseHaodanku('get_deserve_item', parameterNames, {}, {})
  }
  /**
 * 抖货商品API
 * https://www.haodanku.com/api/detail/show/32.html
 * @param {min_id,cat_id,order,back} parameters itemid
 */
  get_trill_data (parameters) {
    const parameterNames = ['min_id', 'cat_id', 'order', 'back']
    return this.baseHaodanku('get_trill_data', parameterNames, {}, parameters)
  }
  /**
 * 精选低价包邮专区API
 * https://www.haodanku.com/api/detail/show/36.html
 * @param {min_id, order, type} parameters itemid
 */
  low_price_Pinkage_data (parameters) {
    const parameterNames = ['min_id', 'order', 'type']
    return this.baseHaodanku('low_price_Pinkage_data', parameterNames, {}, parameters)
  }
  /**
 * 品牌列表API
 * https://www.haodanku.com/api/detail/show/31.html
 * @param {min_id, back, brandcat} parameters itemid
 */
  brandinfo (parameters) {
    const parameterNames = ['min_id', 'back', 'brandcat']
    return this.baseHaodanku('brandinfo', parameterNames, {}, parameters)
  }
  /**
 * 各大榜单API
 * https://www.haodanku.com/api/detail/show/29.html
 * @param {sale_type, min_id, cid, back, item_type} parameters itemid
 */
  sales_list (parameters) {
    const parameterNames = ['sale_type', 'min_id', 'cid', 'back', 'item_type']
    return this.baseHaodanku('sales_list', parameterNames, {}, parameters)
  }
  /**
 * 朋友圈API
 * https://www.haodanku.com/api/detail/show/23.html
 * @param {min_id} parameters itemid
 */
  selected_item (parameters) {
    const parameterNames = ['min_id']
    return this.baseHaodanku('selected_item', parameterNames, {}, parameters)
  }
  /**
 * 热搜关键词记录API
 * https://www.haodanku.com/api/detail/show/6.html
 */
  hot_key () {
    const parameterNames = []
    return this.baseHaodanku('hot_key', parameterNames, {}, {})
  }
  /**
 * 猜你喜欢API
 * https://www.haodanku.com/api/detail/show/17.html
 * @param {itemid} parameters itemid
 */
  get_similar_info (parameters) {
    const parameterNames = ['itemid']
    return this.baseHaodanku('get_similar_info', parameterNames, {}, parameters)
  }
  /**
   * 单品详情API
   * https://www.haodanku.com/api/detail/show/16.html
   * @param {itemid} parameters 见API描述页
   */
  item_detail (parameters) {
    const parameterNames = ['itemid']
    return this.baseHaodanku('item_detail', parameterNames, {}, parameters)
  }
  /**
   * 超级搜索API
   * https://www.haodanku.com/api/detail/show/19.html
   * @param {*} parameters 见API描述页
   */
  supersearch (parameters) {
    const parameterNames = ['keyword', 'back', 'min_id', 'tb_p', 'sort', 'is_tmall', 'is_coupon', 'limitrate', 'startprice']
    return this.baseHaodanku('supersearch', parameterNames, {}, parameters)
  }
  /**
   * 超级分类API
   * https://www.haodanku.com/api/detail/show/9.html
   */
  super_classify (parameters) {
    const parameterNames = []
    return this.baseHaodanku('super_classify', parameterNames, {}, parameters)
  }
  /**
 * 商品筛选API
   * https://www.haodanku.com/api/detail/show/3.html
   * @param {*} parameters 见API描述页
   */
  column (parameters) {
    const parameterNames = ['type', 'back', 'min_id', 'sort', 'cid', 'price_min', 'price_max', 'sale_min', 'sale_max', 'coupon_min', 'coupon_max', 'item_type']
    return this.baseHaodanku('column', parameterNames, {}, parameters)
  }
}
export default new Haodanku()
