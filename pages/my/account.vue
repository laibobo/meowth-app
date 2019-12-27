<template>
	<!-- 个人信息 -->
	<view class="info-list">
		<view @click="handleEditPhoto">
			<label>头像</label>
			<view class="header"><image :src="photo"></image></view>
		</view>
		<view @click="hanleEditNiceName">
			<label>昵称</label>
			<text>哈哈哈哈</text>
		</view>
		<view>
			<label>性别</label>
			<view>
				<picker :value="sex" :range="sexArr" @change="handleSex">
					<view>{{sexArr[sex]}}</view>
				</picker>
			</view>
		</view>
		<view @click="handleEditPhone">
			<label>手机号</label>
			<text>15907626661</text>
		</view>
		<view>
			<label>微信号</label>
			<text>人生若只如初见</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				photo:'',
				sex:0,
				sexArr:[
					'男',
					'女'
				]
			}
		},
		methods: {
			handleEditPhone(){},
			hanleEditNiceName(){},
			handleEditPhoto(){
				const _this = this
				uni.chooseImage({
					count:1,
					success(res) {
						_this.photo=res.tempFilePaths[0]
					}					
				})
			},
			handleSex(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info-list{
		>view{
			position: relative;
			width: 750rpx;
			height: 100rpx;
			box-sizing: border-box;
			display: flex;
			justify-content:space-between;
			align-items:center;
			padding: 0 30rpx;
			font-size: 32rpx;
			&:before{
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
			.header{
				image{
					width: 70rpx;
					height: 70rpx;
					border-radius: 35rpx;
				}
			}
		}
		label{
		}
	}
</style>
