// 请求模块
import axios from 'axios'
import store from '@/store'

import jsonBig from 'json-bigint'
// jsonBig.parse(data)  最常用于服务器返回的 大数字 数据
// jsonBig.stingify(data)  最常用于客户端发送给服务器的的 大数字 数据处理

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net', // 接口的基准路径
  // 预处理服务器返回的数据   // transformRequest  预处理客户端请求的数据
  transformResponse: [
    function (data) {
      try {
        return jsonBig.parse(data)
      } catch (err) {
        return {
          data
        }
      }
    }
  ]
})

// 请求拦截器
request.interceptors.request.use(config => {
  // 请求发起会经过这里
  // config: 本次请求的配置对象

  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
  return config
}, error => {
  // 请求出错了（还没发出去）会进入这里
  return Promise.reject(error)
})

// 响应拦截器

export default request
