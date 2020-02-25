import Vue from 'vue'
import App from './App'
import Loading from '@/components/loading/loading.vue'

Vue.config.productionTip = false
Vue.component('loading',Loading)
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()