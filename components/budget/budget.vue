<template>
	<view class="budget">
		<view class="chart">
			<ring-chart :monthExpendMoney="monthExpendMoney" :monthBudgetMoney="monthBudgetMoney" />
		</view>
		<view class="budgetinfo">
			<view class="major">
				<label>剩余预算：</label>
				<text>{{surplusBudgetMoney | formatMoney }}</text>
			</view>
			<view>
				<label>本月预算：</label>
				<text>{{monthBudgetMoney | formatMoney }}</text>
			</view>
			<view>
				<label>本月支出：</label>
				<text>{{monthExpendMoney | formatMoney }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import RingChart from '@/components/ring-chart/ring-chart.vue'
	export default {
		props:{
			//本月预算
			monthBudgetMoney:{
				type:Number,
				required:true
			},
			//本月支出
			monthExpendMoney:{
				type:Number,
				required:true
			},
			//图表id
			chartElementId:{
				type:String,
				default:'canvasRing_001'
			}
		},
		components:{
			RingChart
		},
		data() {
			return {
				surplusBudgetMoney:0
			}
		},
		created(){
			const monthBudgetMoney = this.monthBudgetMoney,
				monthExpendMoney = this.monthExpendMoney,
				surplusBudgetMoney = monthBudgetMoney - monthExpendMoney
				
			this.surplusBudgetMoney = surplusBudgetMoney > 0? surplusBudgetMoney : 0
		}
	}
</script>

<style lang="scss" scoped>
	.budget{
		display: flex;
		justify-content: space-between;
		.chart{
			width: 200rpx;
			margin-top: -20rpx;
			margin-left: -40rpx;
		}
		.budgetinfo{
			color: #656565;
			font-size: 28rpx;
			margin-top: 45rpx;
			width: 350rpx;
			>view{
				display: flex;
				justify-content: space-between;
				line-height: 50rpx;
				&.major{
					color: #242424;
					font-size: 30rpx;
					border-bottom: 1rpx solid #EDEDED;
					padding-bottom: 5rpx;
					margin-bottom: 5rpx;
				}
			}		
		}
	}
</style>
