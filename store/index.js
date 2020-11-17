import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getters = {
	categoryExpendList:state=>state.category.categoryExpendList,
	categoryIncomeList:state=>state.category.categoryIncomeList,
	monthBudgetMoney:state => state.budget.monthBudgetMoney,
	monthExpendMoney:state => state.budget.monthExpendMoney,
	currentLoadingChartPageCode: state => state.budget.currentLoadingChartPageCode,
	loginUserInfo:state=> state.user.userInfo,
	loginUserPhoto:state=> state.user.userPhoto
}

function downloadFile(imageFileId){
	return new Promise((resolve,reject)=>{
		wx.cloud.downloadFile({
			fileID: imageFileId,
			success: res => {
				resolve(res.tempFilePath)
			},
			fail: err=>{
				resolve(err)
			}
		});
	})
}

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})

const store = new Vuex.Store({
    modules,
    getters
})

export default store