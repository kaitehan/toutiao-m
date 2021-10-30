import Vue from 'vue'
import Vuex from 'vuex'

import { setItem, getItem } from '@/utils/storage'
Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 一个对象，存储当前登录用户信息（token等数据）
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data

      // 为了防止刷新丢失，需要把数据放到本地存储
      setItem(TOKEN_KEY, data)
    }
  },
  actions: {
  },
  modules: {
  }
})
