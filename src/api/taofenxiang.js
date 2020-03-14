import config from '../config'
import fly from './net'
const FORM_DATA_HEADER = { headers: { 'content-type': 'application/x-www-form-urlencoded' }}

const postApi = (api, data) => {
  return fly.post(`${config.api}${api}`, data, FORM_DATA_HEADER).then(res => res.data)
}
const getApi = (api, data) => fly.get(`${config.api}${api}`, data).then(res => res.data)
const internalSetToken = (token) => { fly.config.headers = Object.assign(fly.config.headers, { 'Authorization': 'Bearer ' + token }) }
export default {
  public: {
    announces: () => getApi('/public/announces')
  },
  admin: {
    post_cards: ({ no, secret, amount, created_id }) => postApi('/admin/cards', { no, secret, amount, created_id }),
    cards: ({ page, size, sort }) => postApi('/admin/cards', { page, size, sort }),
    announces: () => getApi('/admin/announces/list'),
    add_announce: ({ content, url }) => postApi('/admin/announces', { content, url }),
    delete_announces: (id) => postApi('/admin/announces/delete', { id }),
    users: ({ page, size, sort }) => postApi('/admin/users', { page, size, sort })
  },
  consumption: {
    post: ({ amount, item_id, item_img, item_link }) => postApi('/consumption', { amount, item_id, item_img, item_link }),
    list: ({ page, size, sort }) => postApi('/consumption/list', { page, size, sort })
  },
  recharge: {
    post: ({ no, secret }) => postApi('/recharge', { no, secret }),
    list: ({ page, size, sort }) => postApi('/recharge/list', { page, size, sort })
  },
  user: {
    setToken: internalSetToken,
    clearToken: () => { delete fly.config.headers['Authorization'] },
    info: () => getApi('/user/info'),
    sendSms: (phone) => postApi('/user/sendSms', { phone }),
    login: ({ phone, code }) => {
      return postApi('/user/login', { phone, code }).then(data => {
        internalSetToken(data.token)
        return data
      })
    }
  },
  wx: {
    login: (data) => {
      return postApi('/wx/login', data)
        .then(data => {
          internalSetToken(data.token)
          return data
        })
    }
  }
}

