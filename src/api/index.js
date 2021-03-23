import axios from 'axios'
import { DEFAULT_OPTION, MIDDLEWAER } from '@/const/index.js'

class Api {
  constructor(config = {}) {
    const { baseConfig = DEFAULT_OPTION, middleWare = MIDDLEWAER } = config

    const { request, response } = middleWare

    this.options = {
      axios: axios.create(baseConfig)
    }

    this.registerMiddleWare(request, response)
  }


  getInstance() {
    return this.options.axios
  }

  request(...args) {
    const instance = this.getInstance()

    const [method, url, data] = args // 规定书写顺序

    const config = {
      url,
      method
    }

    if (['get'].includes(method)) {
      config.params = data
    } else {
      config.data = data
    }

    return instance.request(config)
  }

  init() {
    return {
      get: (...args) => {
        return this.request('get', ...args)
      },

      post: (...args) => {
        return this.request('post', ...args)
      },

      del: (...args) => {
        return this.request('del', ...args)
      },

      put: (...args) => {
        return this.request('put', ...args)
      }
    }
  }

  registerMiddleWare(resquest = [], response = [] ) {
    resquest.forEach(middleWare => {
      this.options.axios.interceptors.request.use(middleWare)
    })

    response.forEach(middleWare => {
      this.options.axios.interceptors.response.use(middleWare)
    })
  }

}


export default Api
