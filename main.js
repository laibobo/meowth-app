import Vue from 'vue'
import App from './App'
import Loading from '@/components/loading/loading.vue'
import { isAuthorize } from '@/public/index.js'
import store from './store'
import config from './public/config.js'

Vue.config.productionTip = false
Vue.component('loading',Loading)
App.mpType = 'app'
Vue.filter('formatMoney',function(value){	return value? Math.floor(value * 100) / 100 : 0})

Vue.prototype.$authorize = isAuthorize
Vue.prototype.$conf = config
Vue.mixin({
	computed:{
		getMonthBudgetMoney(){
			return this.$store.getters.monthBudgetMoney
		},
		getMonthExpendMoney(){
			return this.$store.getters.monthExpendMoney	
		},
		getSurplusBudgetMoney(){
		    const surplusBudgetMoney = this.getMonthBudgetMoney - this.getMonthExpendMoney
			return surplusBudgetMoney > 0? surplusBudgetMoney : 0
		},
		getIsMonthBudget(){
			return this.getMonthBudgetMoney > 0
		},
		getOpenid(){
			return uni.getStorageSync(this.$conf.storageKey.openid)
		},
		getUserInfo(){
			return uni.getStorageSync(this.$conf.storageKey.userInfo) || {}
		}
	},
	methods:{
		loadingBudgetMonthChart(){
			this.$store.commit('SET_LOADINGCHARTPAGECODE',Math.random())
		}
	}
})
const app = new Vue({
    ...App,
	store
})
app.$mount()