// 评论请求模块

import request from '@/utils/request'

// 获取文章评论列表
export const getComment = params => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params
  })
}

// 对评论点赞
export const likeComment = id => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target: id
    }
  })
}
// 取消对评论点赞
export const unlikeComment = id => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${id}`
  })
}

// 对文章或者评论进行评论
export const postComment = data => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
