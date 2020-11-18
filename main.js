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
const getApp2 = getApp();
Vue.mixin({
	data(){
		return {
			scrollHeight:0,
			windowHeight:0
		}
	},
	computed:{
		getMonthBudgetMoney(){
			return this.$store.getters.monthBudgetMoney || 0
		},
		getMonthExpendMoney(){
			return this.$store.getters.monthExpendMoney	|| 0
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
		getScrollHeight() {
			return `height:${this.scrollHeight}px`;
		},
	},
	methods:{
		loadingBudgetMonthChart(){
			this.$store.commit('SET_LOADINGCHARTPAGECODE',Math.random())
		},
		showNetworkIsError(){
			uni.showModal({
				title:'警告',
				content:'请确认网络是否正常~'
			})
		}
	}
})
const app = new Vue({
    ...App,
	store
})
app.$mount()