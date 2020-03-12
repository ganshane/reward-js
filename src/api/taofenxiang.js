import config from '../config'
import fly from './net'

export default {
  admin: {
    post_cards ({ no, owner_id, secret }) {
      return fly.post(`${config.api}/admin/cards`,
        { no, owner_id, secret }, { headers: { 'content-type': 'application/x-www-form-urlencoded' }}
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
        { amount, item_id, item_img, item_link }, { headers: { 'content-type': 'application/x-www-form-urlencoded' }}
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
        { no, secret }, { headers: { 'content-type': 'application/x-www-form-urlencoded' }}
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
    info () {
      return fly.get(`${config.api}/user/info`).then(res => res.data)
    }
  },
  wx: {
    login (data) {
      return fly.post(`${config.api}/wx/login`,
        data, { headers: { 'content-type': 'application/x-www-form-urlencoded' }}
      ).then(res => {
        const data = res.data
        fly.config.headers = Object.assign(fly.config.headers, { 'Authorization': 'Bearer ' + data.token })
        return data
      })
    }
  }
}

