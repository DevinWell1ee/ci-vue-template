export const DEFAULT_OPTION = {
  timeout: 10 * 5000,
  baseURL: '/api',
  headers: {
    post: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; not supported'
    }
  }
}

export const MIDDLEWAER = {
  request: [
    // 数据转换；header变更等
    function testReq(config) {
      console.log('---req')

      return config
    }
  ],
  response: [
    // 网络异常; http状态拦截；业务状态拦截；数据返回格式处理等
    function testReq(config) {
      console.log('---res')

      return config
    }
  ]
}