// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'//应用vueresource
import App from './App'
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from './components/seller/seller'

import './common/stylus/index.styl'


Vue.use(VueRouter)
Vue.use(VueResource)//全局注册一下


Vue.config.productionTip = false
//路由跳转
const routes = [
  {path: '/', component: goods},
  {path: '/goods', component: goods},
  {path: '/ratings', component: ratings},
  {path: '/seller', component: seller}
]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes // short for `routes: routes`
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
