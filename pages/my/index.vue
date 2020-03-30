<template>
	<view>
		<add-btn class="add-btn"></add-btn>
		<view class="header">
			<view class="userinfo" data-url="./account" @click="navigateTo">
				<image :src="photoUrl" :fade-show="false" mode="aspectFit"></image>
				<text>{{ nickName }}</text>
			</view>
			<!-- 统计 -->
			<view class="statistic">
				<view>
					<text>{{ sumDay }}</text>
					<text>记账总天数</text>
				</view>
				<view>
					<text>{{ sumLog }}</text>
					<text>记账总笔数</text>
				</view>
			</view>
		</view>
		<!-- 账单 -->
		<view class="month-bill" hover-class="hoverstatus" data-url="../eportforms/yearbill" @click="navigateTo">
			<view class="title">
				账单
				<view class="icon iconfont">&#xe6ec;</view>
			</view>
			<view class="info">
				<view class="month-s">
					<text class="month">{{ getMonth }}</text>
					<text class="unit">月</text>
				</view>
				<view>
					<label>收入</label>
					<text>{{ monthBill.income }}</text>
				</view>
				<view>
					<label>支出</label>
					<text>{{ monthBill.expenditure }}</text>
				</view>
				<view>
					<label>结余</label>
					<text>{{ monthBill.surplus }}</text>
				</view>
			</view>
		</view>
		<!-- 预算 -->
		<view class="budget-col" hover-class="hoverstatus" data-url="../budget/index" @click="navigateTo">
			<view class="title">
				{{ getMonth }}月总预算
				<view v-if="monthBudgetMoney > 0" class="right-btn">
					<text>查看全部</text>
					<view class="icon iconfont">&#xe6ec;</view>
				</view>
				<view v-else>
					<button class="ybtn">+ 设置预算</button>	
				</view>
			</view>
			<view class="info" v-if="isLoadingBudget"><budget chartElementId="sumbudget" :monthBudgetMoney="monthBudgetMoney" :monthExpendMoney="monthExpendMoney"></budget></view>
		</view>
		<view class="tool">
			<view class="t-item" data-url="../invoice/index" @click="navigateTo">
				<view class="icon-col"><view class="icon iconfont">&#xe71a;</view></view>
				<text>发票助手</text>
			</view>
		</view>
	</view>
</template>

<script>
const app = getApp();
import addBtn from '@/components/add-btn/add-btn.vue';
import Budget from '@/components/budget/budget.vue';
export default {
	components: {
		addBtn,
		Budget
	},
	data() {
		return {
			photoUrl: '',
			nickName: '',
			sumDay: '--',
			sumLog: '--',
			monthBill: {
				income: '0.00',
				expenditure: '0.00',
				surplus: '0.00'
			},
			month: 0,
			monthBudgetMoney: 0,
			monthExpendMoney: 0,
			db: app.globalData.wxDB,
			openid: uni.getStorageSync('user.openid'),
			isLoadingBudget:false,
			monthBudgetId:''
		};
	},
	onShow() {
		this.isLoadingBudget = false
		const _self = this,userInfo = uni.getStorageSync('user.info') || {};
		this.nickName = userInfo.nickName;
		if (userInfo.isCustomPhoto) {
			wx.cloud.downloadFile({
				fileID: userInfo.avatarUrl,
				success: res => {
					_self.photoUrl = res.tempFilePath;
				},
				fail: console.error
			});
		} else {
			this.photoUrl = userInfo.avatarUrl;
		}
		this.getKeepAccountsInfo();
		this.getNowMonthKeepInfo();
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
		navigateTo(e) {
			let url = e.currentTarget.dataset.url;
			if(url === '../budget/index'){
				url = `${url}?monthBudgetMoney=${this.monthBudgetMoney}&monthExpendMoney=${this.monthExpendMoney}&monthBudgetId=${this.monthBudgetId}`
			}
			uni.navigateTo({
				url
			});
		},
		//当月总预算
		getCurrentMonthBudget() {
			const date = new Date();
			const $ = this.db.command.aggregate;
			return this.db
				.collection('Budget')
				.where({
					_openid: this.openid,
					year: date.getFullYear(),
					month: date.getMonth() + 1
				})
				.get();
		},
		//记账统计
		getKeepAccountsInfo() {
			const $ = this.db.command.aggregate;
			const _od = this.db
				.collection('AccountsRecord')
				.aggregate()
				.match({
					_openid: this.openid
				});
			//获取记账总天数
			_od.group({
				_id: '$keepDate'
			})
				.count('sumDay')
				.end()
				.then(res => {
					if (res.list.length > 0) {
						this.sumDay = res.list[0]['sumDay'];
					}
				});
			//获取记账总笔数
			_od.group({
				_id: '$createDate'
			})
				.count('sumLog')
				.end()
				.then(res => {
					if (res.list.length > 0) {
						this.sumLog = res.list[0]['sumLog'];
					}
				});
		},
		//当前月账单
		getNowMonthKeepInfo() {
			const date = new Date();
			this.month = date.getMonth() + 1;
			wx.cloud
				.callFunction({
					name: 'getMonthBill',
					data: {
						openid: this.openid,
						keepYear: date.getFullYear(),
						keepMonth: this.month
					}
				})
				.then(res => {
					let expenditure = 0
					if (res.errMsg === 'cloud.callFunction:ok' && res.result.list.length > 0) {
						expenditure = res.result.list[1]['keepMoney'].toFixed(2);
						this.monthBill.income = res.result.list[0]['keepMoney'].toFixed(2);
						this.monthBill.expenditure = expenditure;
						this.monthBill.surplus = (this.monthBill.income - this.monthBill.expenditure).toFixed(2);	
					}
					this.getCurrentMonthBudget().then(result => {
						if (result.errMsg === 'collection.get:ok' && result.data.length > 0) {
							this.monthBudgetMoney = Number(result.data[0]['money'])
							this.monthBudgetId = result.data[0]['_id']
							this.monthExpendMoney = expenditure
						}
						this.isLoadingBudget = true
					})
				});
		}
	}
};
</script>
<style lang="scss" scoped>
@mixin panel-style {
	background: #fff;
	margin: 20rpx;
	border-radius: 8rpx;
	overflow: hidden;
}
@mixin title-style {
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.icon {
			color: #b3b3b3;
			text-align: right;
			width: 30rpx;
		}
	}
}
.hoverstatus {
	background: #f5f5f5 !important;
}
.add-btn {
	position: fixed;
	right: 40rpx;
	bottom: 80rpx;
	z-index: 10;
}
.budget-col {
	@include panel-style;
	padding: 20rpx 40rpx 50rpx;
	font-size: 32rpx;
	@include title-style;
	.info {
		height: 200rpx;
	}
}
.month-bill {
	@include panel-style;
	margin-top: -80rpx;
	padding: 20rpx 40rpx;
	font-size: 32rpx;
	@include title-style;
	.info {
		display: flex;
		color: #3f3f3f;
		margin-top: 30rpx;
		align-items: flex-end;
		label {
			color: #8f8f8f;
			font-size: 26rpx;
		}
		view {
			display: flex;
			flex-direction: column;
			line-height: 50rpx;
			width: 163.3rpx;
			&.month-s {
				display: flex;
				flex-direction: row;
				height: 50rpx;
				width: 105rpx;
				padding-right: 20rpx;
				margin-right: 40rpx;
				margin-bottom: 10rpx;
				box-sizing: border-box;
				border-right: 2rpx solid #9b9b9b;
				.month {
					font-size: 50rpx;
					font-weight: 400;
				}
				.unit {
					font-size: 26rpx;
					margin-top: 10rpx;
				}
			}
		}
	}
}
.tool {
	@include panel-style;
	padding: 40rpx;
	.t-item {
		width: 100rpx;
		height: auto;
		text-align: center;
		.icon-col {
			background: #f8f8f8;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.iconfont {
				color: #000;
			}
		}
		text {
			font-size: 24rpx;
			color: #333;
		}
	}
}
.header {
	background: #ffdb45;
	border-radius: 0 0 40rpx 40rpx;

	.userinfo {
		margin: 0 40rpx;
		padding: 20rpx 0 0;
		box-sizing: border-box;
		color: #333;
		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50rpx;
			vertical-align: middle;
			margin-right: 40rpx;
		}
	}
	.statistic {
		display: flex;
		padding: 20rpx 0 100rpx;
		> view {
			flex: 1;
			text-align: center;
			> text {
				display: block;
				font-size: 24rpx;
				&:first-child {
					color: #333235;
					font-size: 36rpx;
					font-weight: 600;
				}
				&:last-child {
					color: #565656;
				}
			}
		}
	}
}
</style>
