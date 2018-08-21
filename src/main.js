// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 引入Element-UI
import ElementUI from 'element-ui'
// 引入Element-ui的样式
import 'element-ui/lib/theme-chalk/index.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
// 导入moment
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

// 使用element-ui
Vue.use(ElementUI)
Vue.use(VueQuillEditor)

// 把axios绑定到Vue的原型上即可
Vue.prototype.axios = axios

// 定义时间的过滤器
Vue.filter('dateFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input).format(format)
})

Vue.config.productionTip = false

// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('shoptoken')
// 请求拦截器
axios.interceptors.request.use(function (config) {
  config.baseURL = 'http://localhost:8888/api/private/v1/'
  config.headers.Authorization = localStorage.getItem('shoptoken')
  return config
}, function (error) {
  return Promise.reject(error)
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
