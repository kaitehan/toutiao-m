// 搜索请求模块

import request from '@/utils/request'

// 获取联想建议
export const getSearchSuggestion = val => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q: val
    }
  })
}

// 获取搜索结果
export const getSearchResult = val => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params: val
  })
}
