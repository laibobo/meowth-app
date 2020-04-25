<template>
	<view class="budget-col">
		<view class="overall-budget" v-if="isShow && !isBudgetDialog" @click="openEdit">
			<view class="title">
				{{ getMonth }}月总预算
				<view>编辑</view>
			</view>
			<view class="info"><budget :monthBudgetMoney="monthBudgetMoney" :monthExpendMoney="monthExpendMoney"></budget></view>
		</view>
		<bobo-dialog class="budget-dialog" :visible.sync="isBudgetDialog" :title="overallBudgetTitle" @affirm="affirm" @cancel="cancel">
			<input type="text" v-model="budgetMoney" maxlength="10" placeholder="请输入预算金额" placeholder-style="letter-spacing: 2rpx;font-size:24rpx;color:#D5D5D5;" />
		</bobo-dialog>
		<bobo-dialog class="bm-dialog" :visible.sync="editDialog" type="bottom">
			<view slot="btns">
				<button @click="editSumBudget">编辑总预算</button>
				<button @click="clearSumBudget">清除总预算</button>
			</view>
		</bobo-dialog>
	</view>
</template>

<script>
import Budget from '@/components/budget/budget.vue';
import BoboDialog from '@/components/dialog/dialog.vue';
const app = getApp();
export default {
	components: {
		Budget,
		BoboDialog
	},
	data() {
		const date = new Date();
		return {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			isBudgetDialog: false,
			budgetMoney: null,
			overallBudgetTitle: '',
			DB: null,
			monthBudgetMoney: 0,
			monthExpendMoney: 0,
			isShow: false,
			monthBudgetId: '',
			editDialog: false
		};
	},
	onLoad(option) {
		if (option) {
			this.monthBudgetMoney = Number(option.monthBudgetMoney);
			this.monthExpendMoney = Number(option.monthExpendMoney);
		}
		this.isShow = true;
		this.DB = app.globalData.wxDB;			
		this.overallBudgetTitle = `${this.month}月份总预算`;
		if (this.monthBudgetMoney <= 0) {
			this.isBudgetDialog = true;
		}
	},
	computed: {
		getMonth() {
			let month = this.month;
			if (this.month < 10) {
				month = `0${this.month}`;
			}
			return month;
		}
	},
	methods: {
		openEdit() {
			this.getMonthBudgetId()
			this.editDialog = true;
		},
		getMonthBudgetId(){
			this.DB.collection('Budget').where({
				_openid:uni.getStorageSync('user.openid'),
				year:this.year,
				month:this.month,
				type:0
			}).get().then(({data,errMsg})=>{
				if(errMsg.includes('ok') && data.length > 0){
					this.monthBudgetId = data[0]['_id']
				}
			})	
		},		
		//修改总预算
		editSumBudget() {
			this.editDialog = false;
			this.budgetMoney = this.monthBudgetMoney
			this.isBudgetDialog = true
		},
		//清除总预算
		clearSumBudget(){
			 this.DB.collection('Budget').doc(this.monthBudgetId).remove().then(result=>{
				 if(result.errMsg.includes('ok')){
					this.cancel()
				 }else{
					 uni.showModal({
					 	title:'警告',
						content:result.errMsg
					 })
				 }
			 })
		},
		affirm() {
			this.isBudgetDialog = false
			this.isShow = false
			if (this.budgetMoney === '' || this.budgetMoney <= 0) {
				return;
			}
			let _od = this.DB.collection('Budget'),
				data = {
					money: Number(this.budgetMoney)
				};
			if (this.monthBudgetMoney > 0) {
				_od = _od.doc(this.monthBudgetId).update({
					data
				});
			} else {
				data.expendMoney = 0
				data.type = 0
				data.year = this.year
				data.month = this.month
				_od = _od.add({
					data
				});
			}
			//type 预算类型 0全部预算 1分类预算
			_od.then(result => {
				if (result.errMsg.includes('ok')) {
					this.monthBudgetMoney = data.money
					this.isShow = true
				}
			}).catch(err => {
				uni.showModal({
					title: '警告',
					content: '程序异常!请稍后再试'
				});
			});
		},
		cancel() {
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@mixin headed-title {
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		view {
			color: #ccc;
			font-size: 28rpx;
		}
	}
}
.input-placeholder {
	font-size: 24rpx;
	color: #eee;
}
.budget-dialog {
	input {
		border-bottom: 2rpx solid #e6e6e6;
		padding: 10rpx 0;
		text-align: center;
	}
}
.budget-col {
	.overall-budget {
		background: #fff;
		padding: 20rpx 40rpx 0;
		border-radius: 8rpx;
		overflow: hidden;
		@include headed-title;
	}
}
.bm-dialog {
	button {
		border-radius: 0;
		border: none;
		border-top: 1rpx solid rgba(0, 0, 0, 0.2);
		&:first-child {
			border-top: none;
		}
		&::after {
			border-radius: 0;
			border: none;
		}
	}
}
</style>
