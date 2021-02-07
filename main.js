import Vue from 'vue'
import App from './App'
import { isAuthorize } from '@/public/index.js'
import store from './store'
import config from './public/config.js'

Vue.config.productionTip = false
App.mpType = 'app'
Vue.filter('formatMoney',function(value){	return value? Math.floor(value * 100) / 100 : 0})

const getApp2 = getApp();
Vue.mixin({
	computed:{
	},
	methods:{
	}
})
const app = new Vue({
    ...App,
	store
})
app.$mount()