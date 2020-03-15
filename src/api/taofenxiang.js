import config from '../config'
import RestClient from './net'
const FORM_DATA_HEADER = { headers: { 'content-type': 'application/x-www-form-urlencoded' }}

class Taofenxiang {
  fly () {
    if (this.flyInstance == null) { this.flyInstance = new RestClient(config) }
    return this.flyInstance
  }
  constructor () {
    this._post = (api, data) => {
      return this.fly().post(`${config.api}${api}`, data, FORM_DATA_HEADER).then(res => res.data)
    }
    this._get = (api, data) => { return this.fly().get(`${config.api}${api}`, data).then(res => res.data) }
    this.internalSetToken = (token) => { this.fly().config.headers = Object.assign(this.fly().config.headers, { 'Authorization': 'Bearer ' + token }) }
    this.public = {
      announces: () => this._get('/public/announces'),
      slides: () => this._get('/public/slides'),
      create_tpwd: ({ text, url, logo }) => this._post('/public/tpwd', { text, url, logo })
    }
    this.admin = {
      add_card: ({ no, secret, amount, created_id }) => this._post('/admin/card/add', { no, secret, amount, created_id }),
      cards: ({ page, size, sort }) => this._post('/admin/card/list', { page, size, sort }),

      add_slide: ({ img_url, url, status }) => this._post('/admin/slide/add', { img_url, url, status }),
      delete_slide: (id) => this._post('/admin/slide/delete', { id }),
      update_status: ({ id, status }) => this._post('/admin/slide/status', { id, status }),
      slides: () => this._get('/admin/slide/list'),

      add_announce: ({ content, url }) => this._post('/admin/announce/add', { content, url }),
      delete_announce: (id) => this._post('/admin/announce/delete', { id }),
      announces: () => this._get('/admin/announce/list'),
      users: ({ page, size, sort }) => this._post('/admin/users', { page, size, sort })
    }
    this.consumption = {
      add: ({ amount, item_id, item_img, item_link }) => this._post('/consumption/add', { amount, item_id, item_img, item_link }),
      list: ({ page, size, sort }) => this._post('/consumption/list', { page, size, sort })
    }
    this.recharge = {
      add: ({ no, secret }) => this._post('/recharge/add', { no, secret }),
      list: ({ page, size, sort }) => this._post('/recharge/list', { page, size, sort })
    }
    this.user = {
      setToken: this.internalSetToken,
      clearToken: () => { delete this.fly().config.headers['Authorization'] },
      info: () => this._get('/user/info'),
      sendSms: (phone) => this._post('/user/sendSms', { phone }),
      login: ({ phone, code }) => {
        return this._post('/user/login', { phone, code }).then(data => {
          this.internalSetToken(data.token)
          return data
        })
      }
    }
    this.wx = {
      login: (data) => {
        return this._post('/wx/login', data)
          .then(data => {
            this.internalSetToken(data.token)
            return data
          })
      }
    }
  }
}

export default new Taofenxiang()

