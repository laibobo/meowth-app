const state = {
	monthBudgetMoney:0,
	monthExpendMoney:0
}
const mutations = {
	//月预算金额
	SET_MONTHBUDGEMONEY:(state,value)=>{
		state.monthBudgetMoney = value
	},
	//月支出金额
	SET_MONTHEXPENDMONEY:(state,value)=>{
		state.monthExpendMoney = value
	}
}
export default {
    state,
    mutations
}