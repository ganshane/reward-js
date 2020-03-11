import config from '../config'
import fly from './net'

export default {
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

