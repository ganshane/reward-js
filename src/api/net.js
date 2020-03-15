class RestClient {
  constructor ({ isWx }) {
    if (isWx || typeof (wx) !== 'undefined') {
      const Fly = require('flyio/dist/npm/wx')
      this.fly = new Fly()
    } else {
      this.fly = require('flyio')
    }

    this.config = this.fly.config
    this.interceptors = this.fly.interceptors
    this.get = this.fly.get.bind(this.fly)
    this.post = this.fly.post.bind(this.fly)
  }
}

export default RestClient
