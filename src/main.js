import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Cookies from 'js-cookie'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/base.css'
import 'font-awesome/css/font-awesome.css'

import base from './api/utils/base'
import utils from './api/utils'
import settings from '../settings'

import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

import AMap from 'AMap'

Vue.use(AMap)
Vue.use(VueVideoPlayer)

Vue.use(ElementUI)
Vue.prototype.$message = ElementUI.Message
Vue.prototype.$base = base
Vue.prototype.$utils = utils
Vue.prototype.$settings = settings
Vue.prototype.$cookies = Cookies

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
