// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

// 引入Element-UI
import ElementUI from 'element-ui'
// 引入Element-ui的样式
import 'element-ui/lib/theme-chalk/index.css'
// 使用element-ui
Vue.use(ElementUI)

// 把axios绑定到Vue的原型上即可
Vue.prototype.axios = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
