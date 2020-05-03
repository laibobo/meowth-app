import Vue from 'vue'
import App from './App'
import Loading from '@/components/loading/loading.vue'
import { isAuthorize } from '@/public/index.js'
import store from './store'

Vue.config.productionTip = false
Vue.component('loading',Loading)
App.mpType = 'app'
Vue.filter('formatMoney',function(value){	return Math.floor(value * 100) / 100})
Vue.prototype.$authorize = isAuthorize
const app = new Vue({
    ...App,
	store
})
app.$mount()