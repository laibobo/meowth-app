<template>
	<view class="page">
		<view class="info">
			<view>
				<label>类型</label>
				<text>支出</text>
			</view>
			<view>
				<label>金额</label>
				<text>9999.33</text>
			</view>
			<view>
				<label>日期</label>
				<text>2019年11月23日 星期六</text>
			</view>
			<view>
				<label>备注</label>
				<text>哈茶哈哈是的哈哈茶哈哈是的哈哈茶哈哈是的哈哈茶哈哈是的哈哈茶哈哈是的哈哈茶哈哈是的哈哈茶哈哈是的哈哈茶哈哈是的哈哈茶哈哈是的哈</text>
			</view>
		</view>
		<view class="icon-col"><view class="icon iconfont">&#xe662;</view></view>
		<view class="btn-col">
			<button @click="handleEdit">编辑</button>
			<button @click="handleDelete">删除</button>
		</view>
	</view>
</template>
<script>
	export default {
		data(){
			return {
				
			}
		},
		methods:{
			handleEdit(){
				console.log('编辑')
			},
			handleDelete(){
				console.log('删除')
			}
		}
	}
</script>
<style lang="scss" scoped>
	@mixin border-line {
		content: '';
		position: absolute;
		left: 0;
		bottom: -1rpx;
		width: 1500rpx;
		border-bottom: 1px solid #DCDCDC;
		transform-origin: 0 0;
		transform: scale(0.5, 0.5);
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}
	.page{
		background: #FDFFFE;
		.info{
			width: 750rpx;
			box-sizing: border-box;
			padding-left: 35rpx;
			>view{
				padding: 25rpx 25rpx 25rpx 0;
				position: relative;
				font-size: 32rpx;
				display: flex;
				color: #2B2B2B;
				>label{
					width: 50rpx;
					color: #8B8B8B;
					white-space: nowrap;
					margin-right: 40rpx;
				}
				&::before {
					@include border-line;
				}
			}
		}
		.icon-col{
			width: 200rpx;
			height: 200rpx;
			margin: 150rpx auto;
			.iconfont{
				font-size: 200rpx;
				color: $uni-theme-active-color;
			}
		}
		.btn-col{
			width: 750rpx;
			height: 100rpx;
			overflow: hidden;
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			justify-content: center;
			align-items: center;			
			&:before{
				@include border-line;
				top: 0;
				bottom: initial;
			}
			&::after{
				display: block;
				content: '';
				height: 70rpx;
				width: 0;
				border: 1px solid #DCDCDC;
				position: absolute;
				left: 50%;
				top: 50%;
				margin-top: -20rpx;
				transform-origin: 0 0;
				transform: scale(0.5, 0.5);
			}
			button{
				&::after{
					border: none;
				}
				flex: 1;
				border: none;
				background: none;
				font-size: 32rpx;
				color: #2D2D2D;
			}
		}
	}
</style>