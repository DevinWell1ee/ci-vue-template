const apiContext = require.context('./modules/', true, /\.js$/) // 是否搜索子目录

const api = {}

apiContext.keys().forEach((key) => {
  const apiName = key
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')

  api[apiName] = apiContext(key)
})

export default api
