import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 这里可以用plugin - install的形式
import api from '@/service'
Vue.prototype.$api = api

Vue.config.productionTip = false

const env = process.env.NODE_ENV
if (env === 'development') import('@/mock')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
