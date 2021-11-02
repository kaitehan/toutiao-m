/* eslint-disable promise/param-names */
// 请求模块
import axios from 'axios'
import store from '@/store'

import jsonBig from 'json-bigint'
import router from '@/router'
// jsonBig.parse(data)  最常用于服务器返回的 大数字 数据
// jsonBig.stingify(data)  最常用于客户端发送给服务器的的 大数字 数据处理
// import { refreshToken } from '@/api/user'

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
  if (user && config.url === '/v1_0/authorizations') {
    config.headers.Authorization = `Bearer ${user.refresh_token}`
  } else if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // console.log(config)

  // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
  return config
}, error => {
  // 请求出错了（还没发出去）会进入这里
  return Promise.reject(error)
})

// 是否正在刷新的标记 -- 防止重复发出刷新token接口
let isRefreshing = false
// 失效后同时发送请求的容器 -- 缓存接口
let subscribers = []
// 刷新 token 后, 将缓存的接口重新请求一次
function onAccessTokenFetched (newToken) {
  subscribers.forEach((callback) => {
    callback(newToken)
  })
  // 清空缓存接口
  subscribers = []
}
// 添加缓存接口
function addSubscriber (callback) {
  subscribers.push(callback)
}
// 响应拦截器
request.interceptors.response.use(response => {
  // console.log(response)
  // store.dispatch('refreshUser')
  // 刷新token报错的话, 就需要跳转到登录页面

  return response
}, err => {
  // console.log(err.config)
  // err.response.status为401, 则判断token已经过期
  // /v1_0/authorizations为刷新token的接口, 需要排除掉
  if (err.response.status === 401 && !err.config.url.includes('/v1_0/authorizations')) {
    if (!isRefreshing) {
      isRefreshing = true
      // console.log(5555)
      store.dispatch('refreshUser').then(res => {
        onAccessTokenFetched(res)
      }).catch(() => {
        // 当刷新token失败时，则让用户重新登录
        router.push('/login')
      }).finally(() => {
        isRefreshing = false
      })
    }
    // 将其他接口缓存起来 -- 这个Promise函数很关键
    const retryOriginRequest = new Promise(reslove => {
      // 这里是将其他接口缓存起来的关键, 返回Promise并且让其状态一直为等待状态,
      // 只有当token刷新成功后, 就会调用通过addSubscriber函数添加的缓存接口,
      // 此时, Promise的状态就会变成resolve
      addSubscriber((token) => {
        // 表示用新的token去替换掉原来的token
        err.config.headers.Authorization = token
        // 替换掉url -- 因为baseURL会扩展请求url
        err.config.url = err.config.url.replace(err.config.baseURL, '')
        // 用重新封装的config去请求, 就会将重新请求后的返回
        reslove(request(err.config))
      })
    })

    return retryOriginRequest
  }
  return Promise.reject(err)
})

export default request
