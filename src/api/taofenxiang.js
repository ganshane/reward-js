import config from '../config'
import fly from './net'
const FORM_DATA_HEADER = { headers: { 'content-type': 'application/x-www-form-urlencoded' }}

export default {
  admin: {
    post_cards ({ no, secret, amount, created_id }) {
      return fly.post(`${config.api}/admin/cards`,
        { no, secret, amount, created_id }, FORM_DATA_HEADER
      ).then(res => {
        return res.data
      })
    },
    cards ({ page, size, sort }) {
      return fly.get(`${config.api}/admin/cards`,
        { page, size, sort }
      ).then(res => {
        return res.data
      })
    },
    users ({ page, size, sort }) {
      return fly.get(`${config.api}/admin/users`,
        { page, size, sort }
      ).then(res => {
        return res.data
      })
    }
  },
  consumption: {
    post ({ amount, item_id, item_img, item_link }) {
      return fly.post(`${config.api}/consumption`,
        { amount, item_id, item_img, item_link }, FORM_DATA_HEADER
      ).then(res => {
        return res.data
      })
    },
    list ({ page, size, sort }) {
      return fly.get(`${config.api}/consumption/list`,
        { page, size, sort }
      ).then(res => {
        return res.data
      })
    }
  },
  recharge: {
    post ({ no, secret }) {
      return fly.post(`${config.api}/recharge`,
        { no, secret }, FORM_DATA_HEADER
      ).then(res => {
        return res.data
      })
    },
    list ({ page, size, sort }) {
      return fly.get(`${config.api}/recharge/list`,
        { page, size, sort }
      ).then(res => {
        return res.data
      })
    }
  },
  user: {
    setToken (token) {
      fly.config.headers = Object.assign(fly.config.headers, { 'Authorization': 'Bearer ' + token })
    },
    clearToken () {
      delete fly.config.headers['Authorization']
    },
    info () {
      return fly.get(`${config.api}/user/info`).then(res => res.data)
    },
    sendSms (phone) {
      return fly.post(`${config.api}/user/sendSms`, { phone }, FORM_DATA_HEADER)
    },
    login ({ phone, code }) {
      return fly.post(`${config.api}/user/login`, { phone, code }, FORM_DATA_HEADER)
        .then(res => {
          const data = res.data
          fly.config.headers = Object.assign(fly.config.headers, { 'Authorization': 'Bearer ' + data.token })
          return data
        })
    }
  },
  wx: {
    login (data) {
      return fly.post(`${config.api}/wx/login`, data, FORM_DATA_HEADER)
        .then(res => {
          const data = res.data
          fly.config.headers = Object.assign(fly.config.headers, { 'Authorization': 'Bearer ' + data.token })
          return data
        })
    }
  }
}

