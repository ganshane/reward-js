import config from '../config'

function createFlyInstance () {
  if (config.isWx || typeof (wx) !== 'undefined') {
    const Fly = require('flyio/dist/npm/wx')
    return new Fly()
  } else {
    return require('flyio')
  }
}

const fly = createFlyInstance()

// fly.config.headers = {
//   'Content-Type': 'application/x-www-form-urlencoded'
// }

export default fly
