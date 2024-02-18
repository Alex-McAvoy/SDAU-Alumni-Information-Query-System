/*
 * @Description: vue路由配置项
 * @Author: Alex_McAvoy
 * @Date: 2023-07-15 01:49:50
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 懒加载
const home = () => import("@/views/Home.vue")
const login = () => import("@/views/Login.vue")
const contact = () => import("@/views/ShowContact.vue")

// 静态路由
const routes = [{
    path: '', // 默认页
    redirect: '/login'
  },
  {
    path: '/login', // 登录页
    name: 'login',
    component: login
  },
  {
    path: '/home', // 主页
    name: 'home',
    component: home
  },
  {
    path: '/showContact', // 查看校友页
    name: 'contact',
    component: contact
  }
]

const router = new VueRouter({
  // base: '/',
  // mode: 'history',
  routes
})

// push方法解决相同路径跳转报错
const RouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return RouterPush.call(this, to).catch(err => err)
}

// replace方法
const RouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(to) {
  return RouterReplace.call(this, to).catch(err => err)
}

export default router