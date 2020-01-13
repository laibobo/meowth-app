<template>
	<view>
		<view class="header">
			<view class="userinfo" @click="openUserInfo">
				<image :src="photoUrl"></image>
				<text>{{nickName}}</text>
			</view>
			<view class="statistic">
				<view>
					<text>--</text>
					<text>记账总天数</text>
				</view>
				<view>
					<text>--</text>
					<text>记账总笔数</text>
				</view>
			</view>
		</view>
		<view class="tool">
			
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				photoUrl:'',
				nickName:''
			}
		},
		onLoad(){
			this.photoUrl = app.globalData.userInfo.avatarUrl
			this.nickName = app.globalData.userInfo.nickName
		},
		methods: {
			openUserInfo(){
				uni.navigateTo({
					url: './account'
				});
			}
		}
	}
</script>
<style>
	page{
		background:#F1F1F1;
	}
</style>
<style lang="scss" scoped>
	.tool{
		background: #fff;
		padding: 40rpx;
		margin-top: 20rpx;
		
	}
	.header{
		background: #fff;
		.userinfo{
			margin:0 40rpx;
			border-bottom: 2rpx solid $uni-border-color;
			padding: 40rpx 0;
			box-sizing: border-box;
			color: #333;
			image{
				width: 120rpx;
				height: 120rpx;
				border-radius: 60rpx;
				vertical-align: middle;
				margin-right: 40rpx;
			}
		}
		.statistic{
			display: flex;
			padding: 40rpx 0 20rpx;
			>view{
				flex:1;
				text-align: center;
				>text{
					display: block;
					font-size: 24rpx;
					&:last-child{				
						color: #565656;
					}
				}
			}
		}
	}
</style>
