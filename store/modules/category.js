const state = {
	categoryExpendList:[],
	categoryIncomeList:[]
}
const mutations = {
	//支出类别数据
	SET_CATEGORYEXPENDLIST:(state,value)=>{
		state.categoryExpendList = value
	},
	//收入类别数据
	SET_CATEGORYINCOMELIST:(state,value)=>{
		state.categoryIncomeList = value
	}
}
export default {
    state,
    mutations
}