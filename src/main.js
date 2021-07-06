import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'common/styles/index.scss'
import store from './store'
import 'common/js/navigator-guards.js'
import 'common/js/components-global-regist.js'
import gem from 'common/js/gem.js'
import httpServer from 'common/js/my-axios.js'
import 'common/icons/iconfont.css'
import 'leaflet/dist/leaflet.css'

Vue.use(gem)
Vue.config.productionTip = false
Vue.prototype.$http = httpServer

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
