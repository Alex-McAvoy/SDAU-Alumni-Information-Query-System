/*
 * @Description: Vue 入口文件
 * @Author: Alex_McAvoy
 * @Date: 2023-07-14 22:52:31
 */

import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from '@/router/index.js'
import store from '@/store/index.js'
import global from '@/global.js'

Vue.config.productionTip = false
Vue.prototype.$global = global

Vue.use(ElementUI)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
