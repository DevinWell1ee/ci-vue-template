const Mock = require('mockjs')
const Koa = require('koa')
const Route = require('koa-route')

const app = new Koa()

const testMock = function () {
 return {
    data: {
      list: []
    }
  }
}

app.use(Route.get('/api/test', (ctx) => {
  ctx.response.body = Mock.mock(testMock)
}))

app.listen('8090', () => {
  console.log('监听端口 8090')
})

