<template>
	<view class="page">
		<view class="header">
			<view class="search-col">
				<label>{{ year }}年</label>
				<picker class="searchdate-picker" mode="date" fields="month" :value="searchDate" @change="bindSearchDateChange">
					<view class="uni-input">
						{{ month }}
						<text class="fz10">月</text>
					</view>
				</picker>
			</view>
			<view class="info">
				<view>
					<label>收入</label>
					<view class="money">30.00</view>
				</view>
				<view>
					<label>支出</label>
					<view class="money">2223.42</view>
				</view>
			</view>
		</view>
		<view class="list">
			<view class="list-item">
				<view class="summary">
					<text class="date">11月23日 星期六</text>
					<view class="expenses">
						<text>收入:9</text>
						<text>支出:15</text>
					</view>
				</view>
				<view class="di-info">
					<view class="typeinfo">
						<view class="icon-col"><view class="icon iconfont">&#xe662;</view></view>
						<text class="explain">买秒买</text>
					</view>
					<text class="money">9336</text>
				</view>
			</view>
			<view class="list-item">
				<view class="summary">
					<text class="date">11月23日 星期六</text>
					<view class="expenses">
						<text>收入:9</text>
						<text>支出:15</text>
					</view>
				</view>
				<view class="di-info">
					<view class="typeinfo">
						<view class="icon-col"><view class="icon iconfont">&#xe662;</view></view>
						<text class="explain">买秒买</text>
					</view>
					<text class="money">9336</text>
				</view>
				<view class="di-info">
					<view class="typeinfo">
						<view class="icon-col"><view class="icon iconfont">&#xe662;</view></view>
						<text class="explain">买秒买</text>
					</view>
					<text class="money">9336</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchDate: '',
			year: '',
			month: ''
		};
	},
	onLoad() {
		const nowDate = new Date();
		const year = nowDate.getFullYear();
		const month = nowDate.getMonth() + 1;
		this.year = year;
		this.month = month;
		this.searchDate = `${year}-${month}`;
	},
	methods: {
		bindSearchDateChange(e) {
			const value = e.target.value;
			const dateArr = value.split('-');
			this.year = dateArr[0];
			this.month = dateArr[1];
			this.searchDate = value;
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	padding-top: 110rpx;
	.header {
		width: 750rpx;
		height: 110rpx;
		position: fixed;
		left: 0;
		top: 0;
		box-sizing: border-box;
		padding: 0 30rpx 10rpx;
		display: flex;
		background: $uni-theme-bg-color;
		color: #423114;
		font-size: 38rpx;
		letter-spacing: 1rpx;
		label {
			color: #ab8b29;
			font-size: 28rpx;
			margin-bottom: 10rpx;
			display: block;
		}
		.info {
			width: 520rpx;
			display: flex;
			> view {
				flex: 1;
			}
		}
		.search-col {
			width: 170rpx;
			position: relative;
			&:before {
				content: '';
				display: block;
				height: 40rpx;
				width: 1rpx;
				background: #000;
				position: absolute;
				right: 38rpx;
				bottom: 20rpx;
			}
			.searchdate-picker {
				.uni-input {
					position: relative;
					width: 110rpx;
					box-sizing: border-box;
					&::before {
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-width: 20rpx 12rpx;
						border-style: solid;
						border-color: #363533 transparent transparent transparent;
						position: absolute;
						top: 50%;
						margin-top: -4rpx;
						right: 5rpx;
					}
				}
			}
		}
	}

	.list {
		.list-item {
			width: 750rpx;
			letter-spacing: 1rpx;
			.summary {
				display: flex;
				justify-content: space-between;
				color: #abadac;
				font-size: 24rpx;
				padding: 15rpx 30rpx;
				position: relative;
				&:before {
					content: '';
					position: absolute;
					left: 0;
					bottom: -1rpx;
					width: 1500rpx;
					border-bottom: 1px solid #e6e6e6;
					transform-origin: 0 0;
					transform: scale(0.5, 0.5);
					-webkit-box-sizing: border-box;
					-moz-box-sizing: border-box;
					box-sizing: border-box;
				}
				.expenses {
					text {
						margin-left: 50rpx;
					}
				}
			}
			.di-info {
				&:last-child {
					border-bottom: none;
				}
				padding: 20rpx 30rpx;
				border-bottom: 1px solid #fdfffe;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				color: #000;
				.typeinfo {
					display: flex;
					align-items: center;
					.explain {
						margin-left: 30rpx;
					}
					.icon-col {
						width: 75rpx;
						height: 75rpx;
						border-radius: 37.5rpx;
						background: #f1f3f2;
						display: flex;
						justify-content: center;
						align-items: center;
						.iconfont {
							font-size: 38rpx;
							color: $uni-theme-active-color;
						}
					}
				}
			}
		}
	}
}
.fz10 {
	font-size: 22rpx;
}
</style>
