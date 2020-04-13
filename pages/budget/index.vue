<template>
	<view class="budget-col">
		<view class="overall-budget" v-if="isShow && !isBudgetDialog" @click="openEdit">
			<view class="title">{{month}}月总预算
				<view>编辑</view>
			</view>
			<view class="info">
				<budget :monthBudgetMoney="monthBudgetMoney" :monthExpendMoney="monthExpendMoney"></budget>
			</view>
		</view>
		<bobo-dialog 
			class="budget-dialog" 
			:visible.sync="isBudgetDialog"
			:title="overallBudgetTitle"
			@affirm="affirm"
			@cancel="cancel">
			<input type="text" v-model="budgetMoney" maxlength="20" placeholder="请输入预算金额" placeholder-style="letter-spacing: 2rpx;font-size:24rpx;color:#D5D5D5;" />
		</bobo-dialog>
	</view>
</template>

<script>
	import Budget from '@/components/budget/budget.vue'
	import BoboDialog from '@/components/dialog/dialog.vue'	
	const app = getApp();
	export default {
		components:{
			Budget,
			BoboDialog
		},
		data() {
			return {
				year:'',
				month:'',
				isBudgetDialog:false,
				budgetMoney:null,
				overallBudgetTitle:'',
				DB:null,
				monthBudgetMoney:0,
				monthExpendMoney:0,
				isShow:false,
				monthBudgetId:''
			}
		},
		onLoad(option){
			if(option){
				this.monthBudgetMoney = Number(option.monthBudgetMoney)
				this.monthExpendMoney = Number(option.monthExpendMoney)
				this.monthBudgetId = option.monthBudgetId
			}
			if(this.monthBudgetMoney <= 0){
				this.isBudgetDialog = true
			}
			this.isShow = true
			const date = new Date()
			this.year = date.getFullYear()
			this.month = date.getMonth() + 1
			this.DB = app.globalData.wxDB
			if(this.month < 10){
				this.month = `0${this.month}`
			}
			this.overallBudgetTitle = `${this.month}月份总预算`
		},
		methods:{			
			openEdit(){
				this.budgetMoney = this.monthBudgetMoney
				this.isBudgetDialog = true
			},
			affirm(){
				if(this.budgetMoney === '' || this.budgetMoney <= 0){
					return
				}
				let _od = this.DB.collection('Budget'),
					data = {
						type:0,
						money:Number(this.budgetMoney),
						year:Number(this.year),
						month:Number(this.month)
					}
				if(this.monthBudgetMoney > 0){					
					_od = _od.doc(this.monthBudgetId).update({
						data
					})
				}else{
					_od = _od.add({
						data
					})
				}
				//type 预算类型 0全部预算 1分类预算
				_od.then(result=>{
					if(result.errMsg.indexOf('ok') > -1){
						uni.navigateBack({
							delta:1
						})
					}
				}).catch(err=>{
					console.error(err)
					uni.showModal({
						title:"警告",
						content:"程序异常!请稍后再试"
					})
				})
			},
			cancel(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@mixin headed-title {
		.title{
			display: flex;
			justify-content: space-between;
			align-items:center;
			view{
				color: #ccc;
				font-size: 28rpx;
			}
		}
	}
	.input-placeholder{
		font-size: 24rpx;
		color: #eee;		
	}
	.budget-dialog{
		input{
			border-bottom: 2rpx solid #E6E6E6;
			padding: 10rpx 0;
			text-align: center;
		}
	}
	.budget-col{
		.overall-budget{
			background: #fff;
			padding: 20rpx 40rpx 0;
			border-radius: 8rpx;
			overflow: hidden;
			@include headed-title;
		}
	}
</style>
