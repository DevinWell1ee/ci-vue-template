import Api from '@/api'

const myApi = new Api().init() // 这一步可以全局做

export const testHttp = () => myApi.get('test')