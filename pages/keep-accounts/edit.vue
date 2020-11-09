<template>
	<view class="page">
		<view class="info">
			<view>
				<label>类型</label>
				<text>{{categoryType}}</text>
			</view>
			<view>
				<label>类别</label>
				<text>{{categoryName}}</text>
			</view>
			<view>
				<label>金额</label>
				<text>{{keepMoney | formatMoney}}</text>
			</view>
			<view>
				<label>日期</label>
				<text>{{keepDate}}</text>
			</view>
			<view>
				<label>备注</label>
				<text>{{remark}}</text>
			</view>
		</view>
		<view class="icon-col"><view class="icon iconfont" :style="getIconColor" v-html="categoryIcon"></view></view>
	</view>
</template>
<script>
const app = getApp()
export default {
	data() {
		return {
			keepAccountId:'',
			categoryType:'',
			keepMoney:'',
			keepDate:'',
			remark:'',
			categoryName:'',
			categoryIcon:''
		};
	},
	onLoad(options){
		this.keepAccountId = options.keepAccountId
	},
	onShow(){
		uni.showLoading({
			title:'数据加载中...'
		})
		wx.cloud.callFunction({
			name:'getKeepAccountInfo',
			data:{
				keepAccountId:this.keepAccountId
			}
		}).then(res=>{
			uni.hideLoading()
			if(res.errMsg === 'cloud.callFunction:ok' &&  res.result.list.length > 0){
				const data = res.result.list[0]
				this.categoryType = data.categoryType === 0?'支出':'收入'
				this.keepMoney = data.keepMoney
				this.keepDate = `${data.keepYear}年${data.keepMonth}月${data.keepDay}日`
				this.remark = data.remark
				this.categoryName = data.categorys[0].name
				this.categoryIcon = data.categorys[0].icon
			}else{
				uni.showModal({
					title:'提示',
					content:result.errMsg
				})
			}
		}).catch(err=>{
			this.showNetworkIsError()
			console.error(err)
		})
	},
	computed:{
		getIconColor(){
			return `color:#${this.categoryType === '收入'?'fb5e33':'30ac84'} !important;`
		}
	}
};
</script>
<style lang="scss" scoped>
@mixin border-line {
	content: '';
	position: absolute;
	left: 0;
	bottom: -1rpx;
	width: 1500rpx;
	border-bottom: 1px solid #dcdcdc;
	transform-origin: 0 0;
	transform: scale(0.5, 0.5);
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
}
.page {
	background: #fdfffe;
	.info {
		width: 750rpx;
		box-sizing: border-box;
		padding-left: 35rpx;
		> view {
			padding: 25rpx 25rpx 25rpx 0;
			position: relative;
			font-size: 32rpx;
			display: flex;
			color: #2b2b2b;
			> label {
				width: 50rpx;
				color: #8b8b8b;
				white-space: nowrap;
				margin-right: 40rpx;
			}
			&::before {
				@include border-line;
			}
		}
	}
	.icon-col {
		width: 200rpx;
		height: 200rpx;
		margin: 150rpx auto;
		.iconfont {
			font-size: 200rpx;
			color: red;
		}
	}
	.btn-col {
		width: 750rpx;
		height: 100rpx;
		overflow: hidden;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		&:before {
			@include border-line;
			top: 0;
			bottom: initial;
		}
		&::after {
			display: block;
			content: '';
			height: 70rpx;
			width: 0;
			border: 1px solid #dcdcdc;
			position: absolute;
			left: 50%;
			top: 50%;
			margin-top: -20rpx;
			transform-origin: 0 0;
			transform: scale(0.5, 0.5);
		}
		button {
			&::after {
				border: none;
			}
			flex: 1;
			border: none;
			background: none;
			font-size: 32rpx;
			color: #2d2d2d;
		}
	}
}
</style>
<style>
	page{
		background: #fff;
	}
</style>
