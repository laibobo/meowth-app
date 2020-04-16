<template>
	<view>
		<view class="info">
			<view class="header">
				<text class="title"></text>
				<view class="yeardate-select">
					<picker mode="date" fields="year" :value="yearDate" @change="bindYearDateChange">
						<view class="uni-input">{{yearDate}}年</view>
					</picker>
				</view>
			</view>
			<view class="content">
				<view class="surplus">
					<label>结余</label>
					<text>{{yearBill.surplus |formatMoney }}</text>
				</view>
				<view class="income">
					<label>收入</label>
					<text>{{yearBill.income |formatMoney }}</text>
				</view>
				<view class="expenditure">
					<label>支出</label>
					<text>{{yearBill.expenditure |formatMoney }}</text>
				</view>
			</view>
		</view>
		<view class="month-bill-info">
			<view class="table-header">
				<label>月份</label>
				<label>收入</label>
				<label>支出</label>
				<label>结余</label>				
			</view>
			<scroll-view class="table-body-scroll" scroll-y="true" :style="getScrollHeight">
				<view class="item" v-for="(item,index) in yearBillList" :key="index">
					<text>{{item.month}}月</text>
					<text>{{item.income |formatMoney }}</text>
					<text>{{item.expenditure |formatMoney }}</text>
					<text>{{item.surplus |formatMoney }}</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data(){
			return {
				yearDate:null,
				yearBillList:[],
				yearBill:{
					income:'0.00',
					expenditure:'0.00',
					surplus:'0.00'
				},
				scrollHeight:0
			}
		},
		onLoad(){
			const _self=this;
			this.yearDate = new Date().getFullYear()
			uni.getSystemInfo({
				success: function(res) {
					uni.createSelectorQuery()
						.select('.info')
						.boundingClientRect(e => {
							 uni.createSelectorQuery()
								.select('.table-header')
								.boundingClientRect(header => {										
									_self.scrollHeight = parseFloat(res.windowHeight) - parseFloat(e.height) - parseFloat(header.height)
								}).exec();
						}).exec();
				}
			})
			
		},
		onShow(){
			this.getYearBillList()
			this.getNowMonthKeepInfo()
		},
		computed:{
			getScrollHeight(){
				return `height:${this.scrollHeight}px;`
			}
		},
		methods:{
			bindYearDateChange(e){
				this.yearDate = Number(e.detail.value)
				this.getNowMonthKeepInfo()
				this.getYearBillList()
			},
			getNowMonthKeepInfo(){
				uni.showLoading({
					title:'数据加载中...'
				})
				const db = app.globalData.wxDB;
				const $ = db.command.aggregate;
				this.yearBill.income = '0.00'
				this.yearBill.expenditure = '0.00'
				this.yearBill.surplus = '0.00'
				db.collection('AccountsRecord').aggregate()
					.match({
						_openid:uni.getStorageSync('user.openid'),
						keepYear: this.yearDate
					}).group({
						_id:'$categoryType',
						keepMoney:$.sum('$keepMoney')
					})
					.end()
					.then(res=>{
						if(res.errMsg === 'collection.aggregate:ok' && res.list.length > 0){
							const filterExpenditure = res.list.filter(o=>o._id === 0)
							const filterIncome = res.list.filter(o=>o._id === 1)
							if(filterExpenditure.length > 0){
								this.yearBill.expenditure = filterExpenditure[0]['keepMoney'].toFixed(2);
							}
							if(filterIncome.length > 0){
								this.yearBill.income = filterIncome[0]['keepMoney'].toFixed(2);							
							}
							this.yearBill.surplus = (this.yearBill.income - this.yearBill.expenditure).toFixed(2)
						}
						uni.hideLoading()
					}).catch(_=>{
						uni.hideLoading()
					})
			},
			getYearBillList(){
				const db = app.globalData.wxDB;
				const $ = db.command.aggregate;
				db.collection('AccountsRecord')
					.aggregate()
					.match({
						_openid: uni.getStorageSync('user.openid'),
						keepYear:this.yearDate
					}).group({
						_id: {
							keepMonth:'$keepMonth'
						},
						students: $.push({
							categoryType: '$categoryType',
							keepMoney:'$keepMoney'
						})
					})
					.end()
					.then(res => {
						const list = res.list
						let arr = []
						for(let i=0,len=list.length;i<len;i++){
							const childList =list[i]['students']
							const month = list[i]['_id']['keepMonth']
							let res1 = childList.filter(o=>o.categoryType === 0).reduce((acc,cur) => {
							    return acc+cur.keepMoney
							},0)
							let res2 = childList.filter(o=>o.categoryType === 1).reduce((acc,cur) => {
							    return acc+cur.keepMoney
							},0)
							arr.push({
								month,
								expenditure:res1.toFixed(2),
								income:res2.toFixed(2),
								surplus:(res2-res1).toFixed(2)
							})
						}
						this.yearBillList = arr
					});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info{
		background: #FFDB45;
		height: 340rpx;
		.header{
			display: flex;
			justify-content: space-between;
			padding:0 30rpx;
			.title{
				font-weight: 600;
			}
			.yeardate-select{
				.uni-input{
					position: relative;
					width: 140rpx;
					&::before{
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-width: 16rpx 10rpx;
						border-style: solid;
						border-color: #333136 transparent transparent transparent;
						position: absolute;
						top: 50%;
						margin-top: -4rpx;
						right: 5rpx;
					}
				}
			}
		}
		.content{
			display: flex;
			flex-wrap: wrap;
			view{
				width: 375rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 50rpx;
				box-sizing: border-box;
				&:last-child{
					border-left: 3rpx solid #DCBC40;
				}
				label{
					color: #A58D34;
					margin-right: 20rpx;
				}
				text{
					font-size: 42rpx;
				}
			}
			.surplus{
				width: 750rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				line-height: 80rpx;
				margin:0;
				label{
					margin: 0;
				}
				text{
					font-size: 80rpx;
					font-weight: 400;
				}
			}
		}
	}
	.month-bill-info{
		.table-header{
			display: flex;
			padding-top: 20rpx;
			padding-bottom: 8rpx;
			border-bottom: 1rpx solid #eee;
			box-sizing: border-box;
			label{
				display: block;
				width: 209.83rpx;
				color: #919191;
				font-size: 24rpx;
				padding-left: 10rpx;
				box-sizing: border-box;
				&:first-child{
					padding-left: 30rpx;
					width: 120.5rpx;
				}
			}
		}
		.table-body-scroll{
			.item{
				border-top: 1rpx solid #eee;
				height: 80rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				margin-top: -1rpx;
				text{
					display: block;
					width: 209.83rpx;
					color: #716F70;
					letter-spacing: 2rpx;
					font-size: 28rpx;
					box-sizing: border-box;
					&:first-child{
						padding-left: 30rpx;
						width: 120.5rpx;
					}
				}
			}
		}
	}
</style>
<style>
	page{
		background: #FFFFFF;
	}
</style>
