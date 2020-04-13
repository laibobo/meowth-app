import Vue from 'vue'
import App from './App'
import Loading from '@/components/loading/loading.vue'
import { isAuthorize } from '@/public/index.js'

Vue.config.productionTip = false
Vue.component('loading',Loading)
App.mpType = 'app'

Vue.prototype.$authorize = isAuthorize
const app = new Vue({
    ...App
})
app.$mount()