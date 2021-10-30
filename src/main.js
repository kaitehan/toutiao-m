import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载 Vant 核心组件库
import Vant from 'vant'

// 加载 Vant 全局样式
import 'vant/lib/index.css'

// 加载全局样式
import './styles/index.less'

// 加载动态设置REM基准值
import 'amfe-flexible'

// 加载时间处理模块
import './utils/dayjs'

// 注册使用Vant组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
