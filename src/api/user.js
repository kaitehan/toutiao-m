// 用户相关请求

import request from '@/utils/request'

// 登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}

// 发送验证码
// 注意：每个手机号每分钟1次
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
    // headers: {
    //   // 注意：该接口需要授权才能访问
    //   //      token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取用户频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}
// 关注用户
export const followUser = (id) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target: id
    }
  })
}
// 取消关注用户
export const cancleFollowUser = (id) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${id}`
  })
}

// 收藏文章
export const starArticle = (id) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target: id
    }
  })
}
// 取消收藏文章
export const unstarArticle = (id) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${id}`
  })
}

// 点赞文章
export const likeArticle = (id) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/dislikes',
    data: {
      target: id
    }
  })
}
// 取消点赞文章
export const unlikeArticle = (id) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/dislikes/${id}`
  })
}

// 获取当前登录用户的个人资料
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}
// 更新用户的个人资料
export const updateUserProfile = (data) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}
// 更新用户的头像
export const updateUserPhoto = (data) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}
