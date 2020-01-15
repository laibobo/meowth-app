<template>
	<view class="page">
		<view class="header">
			<view class="search-col">
				<label>{{ year }}年</label>
				<picker 
					class="searchdate-picker" 
					mode="date" 
					fields="month" 
					:value="searchDate" 
					@change="bindSearchDateChange">
					<view class="uni-input">
						{{ month }}
						<text class="fz10">月</text>
					</view>
				</picker>
			</view>
			<view class="info">
				<view>
					<label>收入</label>
					<view class="money">{{incomeSum}}</view>
				</view>
				<view>
					<label>支出</label>
					<view class="money">{{expenditureSum}}</view>
				</view>
				<view>
					<label>结余</label>
					<view class="money">{{incomeSum-expenditureSum}}</view>
				</view>
			</view>
		</view>
		<scroll-view class="list" scroll-y="true" :style="getScrollHeight">
			<view class="list-item" v-for="(item,index) in keepLogs" :key="index">
				<view class="summary">
					<text class="date">{{item[0].keepMonth}}月{{item[0].keepDay}}日 {{item[0].keepWeek}}</text>
					<view class="expenses">
						<text class="income">收入 {{getYearMoneySum(1,item)}}</text>
						<text class="expend">支出 {{getYearMoneySum(0,item)}}</text>
					</view>
				</view>
				<view class="di-info" v-for="(childItem,idx) in item" :key="idx">
					<view class="typeinfo">
						<view class="icon-col"><view class="icon iconfont">&#xe662;</view></view>
						<text class="explain">{{childItem.remark}}</text>
					</view>
					<text class="money income" v-if="childItem.categoryType===1">+{{childItem.keepMoney}}</text>
					<text class="money expend" v-else>-{{childItem.keepMoney}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
const app = getApp()
import {getElement} from '@/public/index.js'
export default {
	data() {
		return {
			searchDate: '',
			year: '',
			month: '',
			keepLogs:{},
			incomeSum:0,
			expenditureSum:0,
			scrollHeight:0
		};
	},
	onLoad() {
		const nowDate = new Date();
		const year = nowDate.getFullYear();
		let month = nowDate.getMonth() + 1;
		if(month<10){
			month = '0'+ month
		}
		this.year = year;
		this.month = month;
		this.searchDate = `${year}-${month}`;
		this._db = app.globalData.wxDB
	},
	onShow(){
		this.getNowYearMonthAccountLog()
		const that = this
		getElement('.header').then(e=>{
			uni.getSystemInfo({
				success: function(res) {
					that.scrollHeight = res.windowHeight - e.height;
				}
			});
		});
	},
	computed: {
		getScrollHeight() {
			return `height:${this.scrollHeight}px;`;
		}
	},
	methods: {
		getNowYearMonthAccountLog(){
			this._db.collection('AccountsRecord').where({
				_openid:app.globalData.openid,
				keepYear:this.year,
				keepMonth:Number(this.month)
			}).get().then(res=>{ 
				this.keepLogs = this._dataGroup(res.data)
				this.incomeSum = this.getYearMoneySum(1,res.data)
				this.expenditureSum = this.getYearMoneySum(0,res.data)
			})
		},
		getYearMoneySum(type,list=[]){
			let result = list.filter(o=>o.categoryType === type).map(p=>p.keepMoney)
			if(result.length > 0){
				return result.reduce((a,b)=>a+b)
			}
			return 0
		},
		_dataGroup(data){
			let keyContainer = {}
			data.forEach(element=>{
				keyContainer[element.keepDay] = keyContainer[element.keepDay] || []
				keyContainer[element.keepDay].push(element)
			})
			return keyContainer
		},
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
		color: $uni-theme-font-color;
		font-size: 38rpx;
		letter-spacing: 1rpx;
		label {
			color: $uni-theme-font-color;
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
				background: #fff;
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
						border-width: 15rpx 12rpx;
						border-style: solid;
						border-color: #fff transparent transparent transparent;
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
			.income{
				color: #FB5E33;
				font-weight: 600;
			}
			.expend{
				color: #30AC84;
				font-weight: 600;
			}
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
				.date{
					color: #000;
					font-size: 28rpx;
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
							color: $uni-theme-icon-color;
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
