import fly from 'flyio'
import config from './config'

fly.config.headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
}

export default {
  fetchGoods ({ nav = 3, cid = 0, back = 10, minId = 1 }) {
    return fly.get(`${config.haodankuApi}/itemlist/apikey/${config.haodankuKey}/nav/${nav}/cid/${cid}/back/${back}/min_id/${minId}`)
      .then(res => {
        return JSON.parse(res.data)
      })
  }
}
