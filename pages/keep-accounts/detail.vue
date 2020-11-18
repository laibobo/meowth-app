<template>
	<view class="page">
		<circle-button class="add-btn" />
		<view class="header">
			<view class="search-col">
				<label>{{ year }}年</label>
				<picker class="searchdate-picker" mode="date" fields="month" :value="searchDate" @change="handleDate">
					<view class="uni-input">
						{{ month }}
						<text class="fz10">月</text>
					</view>
				</picker>
			</view>
			<view class="info">
				<view>
					<label>收入</label>
					<view class="money">{{ incomeSum | formatMoney }}</view>
				</view>
				<view>
					<label>支出</label>
					<view class="money">{{ expenditureSum |formatMoney }}</view>
				</view>
				<view>
					<label>结余</label>
					<view class="money">{{ surplusSum | formatMoney }}</view>
				</view>
			</view>
		</view>
		<scroll-view class="list" scroll-y="true" :style="getScrollHeight">
			<view class="list-item" v-for="(item, index) in keepLogs" :key="index">
				<view class="summary">
					<text class="date">{{ item.month }}月{{ item.day }}日 {{ item.weekSeveral }}</text>
					<view class="expenses">
						<text class="income">收入 {{ item.incomeSum | formatMoney }}</text>
						<text class="expend">支出 {{ item.expendSum | formatMoney}}</text>
					</view>
				</view>
				<uni-swipe-action>
					<uni-swipe-action-item v-for="(childItem, idx) in item.logs" :key="idx" :options="getSwipeOptions(childItem._id,item._id,index,childItem.categoryType,childItem.money)" @click="handleSwipe">
				        <view class="di-info">
				        	<view class="typeinfo">
				        		<view class="icon-col"><view class="icon iconfont" v-html="childItem.categoryIcon"></view></view>
				        		<text class="explain">{{ childItem.categoryName }} {{ childItem.remark }}</text>
								<text v-if="childItem.imageFileId" class="icon iconfont" style="color:red;">&#xe6f4;</text> 
				        	</view>
				        	<text class="money income" v-if="childItem.categoryType === 1">+{{ childItem.money | formatMoney }}</text>
				        	<text class="money expend" v-else>-{{ childItem.money | formatMoney }}</text>
				        </view>
				    </uni-swipe-action-item>
				</uni-swipe-action>
			</view>
			<view class="s-b" v-if="!isLoading && Object.keys(keepLogs).length == 0">
				<image :src="require('@/static/image/nodata.png')" mode="aspectFit"></image>
				<view class="msg">
					<view>看啥，快去创建你的第一笔账吧~ </view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { getElement } from '@/public/index.js';
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
import circleButton from '@/components/circle-button/circle-button.vue'
import { getKeepAccountList,getKeepRecord,getkeepRecordById,removeKeepRecord,updateKeepRecord } from '@/public/api.js'

export default {
	components: {
		uniSwipeAction,
		uniSwipeActionItem,
		circleButton
	},
	data() {
		return {
			searchDate: '',
			year: '',
			month: '',
			keepLogs: [],
			surplusSum:0,
			incomeSum: 0,
			expenditureSum: 0,
			isLoading:false
		};
	},
	onLoad() {
		const nowDate = new Date();
		const year = nowDate.getFullYear();
		let month = nowDate.getMonth() + 1;
		if (month < 10) {
			month = '0' + month;
		}
		this.year = year;
		this.month = month;
		this.searchDate = `${year}-${month}`;
	},
	onShow() {
		this.getNowYearMonthAccountLog();
		this.getNowBill()
		const that = this;
		getElement('.header').then(e => {
			uni.getSystemInfo({
				success: function(res) {
					that.scrollHeight = res.windowHeight - e.height;
				}
			});
		});
	},
	methods: {
		getNowYearMonthAccountLog() {
			this.keepLogs = []
			uni.showLoading({
				title:'数据加载中...'
			})
			this.isLoading = true
			getKeepAccountList({
					openid:uni.getStorageSync(this.$conf.storageKey.openid),
					keepYear: this.year,
					keepMonth: this.month
			}).then(res=>{
				this.keepLogs = res.result.data			
				uni.hideLoading()				
				this.isLoading = false
			}).catch(err=>{
				uni.hideLoading()
				this.isLoading = false
				this.showNetworkIsError()
				console.error(err)
			})
		},
		//当前月账单
		getNowBill() {
			getKeepRecord({
				_openid:uni.getStorageSync(this.$conf.storageKey.openid),
				year:Number(this.year) ,
				month:Number(this.month)
			}).then(({data,errMsg})=>{
				if(errMsg.includes('ok') && data.length > 0){
					const { expendSum,incomeSum } = data[0]
					this.expenditureSum = expendSum
					this.incomeSum = incomeSum
					this.surplusSum = this.incomeSum - this.expenditureSum
				}else{
					this.expenditureSum = 0
					this.incomeSum = 0
					this.surplusSum = 0
				}
			})
		},
		//删除记账记录
		deleteKeepAccount(childId,parentId,parentIDX,type,keepMoney){
			uni.showLoading({
				title:'删除中...'
			})
			getkeepRecordById(parentId).then(({data,errMsg})=>{
				if(errMsg.includes('ok')){
					this.deleteKeepLog(data,childId,parentIDX,type,keepMoney).then(res=>{						
						if(res.errMsg.includes('ok')){
							uni.showToast({
								icon:'success',
								title:'删除成功'
							})							
							this.getNowBill()
						}else{
							uni.showModal({
								title:'提示',
								content:errMsg 
							})
						}
					}).catch(err=>{
					 	this.showNetworkIsError()
						console.error(err)
					})
				}
			})
				
				
		},
		deleteKeepLog(data,childId,parentIDX,type,keepMoney){			
			if(data.logs.length === 1){
				this.keepLogs.splice(parentIDX,1)
				return removeKeepRecord(data._id)
			}
			
			const dataIdx = data.logs.findIndex(f=>f._id === childId)			
			let expendSum = data.expendSum,incomeSum = data.incomeSum
			if(type === 0){
				expendSum = expendSum - keepMoney
			}else{
				incomeSum = incomeSum - keepMoney
			}
			if(dataIdx > -1){
				data.logs.splice(dataIdx,1)
				this.keepLogs[parentIDX].logs.splice(dataIdx,1)
				this.keepLogs[parentIDX].expendSum = expendSum
				this.keepLogs[parentIDX].incomeSum = incomeSum
			}			
			return updateKeepRecord({
				recordId:data._id,
				data:{
					logs:data.logs,
					expendSum,
					incomeSum
				}
			})
		},
		handleDate(e) {
			const value = e.target.value;
			const [year, month] = value.split('-');
			this.year = year;
			this.month = month;
			this.searchDate = value;
			this.getNowYearMonthAccountLog();
		},
		handleSwipe({content}){
			const _self = this
			const keepAccountId = content._id,parentId = content.parentId
			if(content.code === 'detail'){
				uni.navigateTo({
					url:'./info?keepAccountId='+keepAccountId+ '&parentId='+parentId
				})
			}else if(content.code === 'edit'){
				uni.navigateTo({
					url:'./index?keepAccountId='+keepAccountId+'&parentId='+parentId+'&type='+content.type
				})
			}else if(content.code === 'delete'){
				uni.showModal({
					title: '警告',
					content: '确认删除该条记账吗？',
					success: function(res) {
						if (res.confirm) {
							_self.deleteKeepAccount(keepAccountId,parentId,content.parentIDX,content.type,content.keepMoney)
						}
					}
				});
			}
		},
		getSwipeOptions(id,parentId,parentIDX,type,keepMoney){
			return [{
				text: '详细',
				_id:id,
				parentId,
				type,
				code:'detail',
				style: {
					backgroundColor: '#07c160'
				}
			},{
				text: '编辑',
				_id:id,
				parentId,
				type,
				code:'edit',
				style: {
					backgroundColor: '#FFA500'
				}
			},{
				text: '删除',
				_id:id,
				parentId,
				parentIDX,
				keepMoney,
				type,
				code:'delete',
				style: {
					backgroundColor: '#dd524d'
				}
			}]
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	padding-top: 110rpx;
	.add-btn{
		position: fixed;
		right: 40rpx;
		bottom: 80rpx;
		z-index: 10;
	}
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
		color: #383437;
		font-size: 38rpx;
		letter-spacing: 1rpx;
		label {
			color:#A37D0B;
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
						border-color: #383437 transparent transparent transparent;
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
			.income {
				color: #fb5e33;
				font-weight: 600;
			}
			.expend {
				color: #30ac84;
				font-weight: 600;
			}
			.summary {
				display: flex;
				justify-content: space-between;
				color: #abadac;
				font-size: 24rpx;
				padding: 15rpx 30rpx;
				position: relative;
				border-top: 2rpx solid #e6e6e6;
				// &:before {
				// 	content: '';
				// 	position: absolute;
				// 	left: 0;
				// 	bottom: -2rpx;
				// 	width: 1500rpx;
				// 	border-bottom: 2rpx solid #e6e6e6;
				// 	transform-origin: 0 0;
				// 	transform: scale(0.5, 0.5);
				// 	-webkit-box-sizing: border-box;
				// 	-moz-box-sizing: border-box;
				// 	box-sizing: border-box;
				// }
				.date {
					color: #A1A1A1;
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
				width: 750rpx;
				box-sizing: border-box;
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
						width: 500rpx;
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
							color: #FED845;
							font-weight: 600;
						}
					}
				}
			}
		}
	}
	
	.s-b{
		position: relative;
		top: 250rpx;
		width: 300rpx;
		margin-left: 20rpx;
		>image{
			display: block;
			width: 100%;
			height: 300rpx;
		}
		.msg{
			width: 250rpx;
			height: 130rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			border: 2rpx solid #eee;
			border-radius: 20% 50%;
			top:-120rpx;
			right: -150rpx;
			font-size: 24rpx;
			padding: 10rpx;
			box-sizing: border-box;
			&::after{
				display: block;
				content: '';
				width: 40rpx;
				height: 30rpx;
				border: 1px solid #eee;
				border-radius: 50% 40%;
				position: absolute;
				bottom: -30rpx;
				left: -10rpx;
			}
		}
	}
}
.fz10 {
	font-size: 22rpx;
}
</style>
<style>
	page{
		background: #fff;
	}
	
</style>
