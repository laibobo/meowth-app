<template>
	<view class="col">
		<image class="logo" :src="require('@/static/image/miao.png')"></image>
		<view class="msg-col">
			<view class="msg">作者喜欢猫，所以开发了这款以猫作为主题的免费记账app。由于白天上班，只有在闲暇之余才有时间维护与迭代功能，所以功能还不完整。</view>
			<view class="msg last">希望喵友们踊跃的提建议（主题idea）以及反馈使用时觉得不友好的地方。作者会整理比较合理的建议反馈，在下几个版本中体现。</view>
		</view>
		<view class="btns-col">
			<view class="btn" data-url="../rests/feedback" @click="navigateTo"> >>> 去建议或反馈</view>
			<view class="btn"  data-url="../rests/reward" @click="navigateTo"> >>> 去打赏</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
		};
	},
	onLoad() {
	},
	methods:{
		navigateTo(e) {
			const url = e.currentTarget.dataset.url
			
			uni.navigateTo({
				url
			});	
		},
	}
};
</script>
<style lang="scss" scoped>
	.col{
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #fff !important;
		.logo{
			position: absolute;
			right: -20rpx;
			top: 150rpx;
			float: right;
			z-index: 1;
		}
		.msg-col{
			position: absolute;
			left: 0;
			z-index: 2;
			top: 50rpx;
			.msg{
				text-indent: 50rpx;
				padding: 0 20rpx;
				line-height: 50rpx;
				color: #565656;
				text-shadow:2px 5px 5px #FFDB45;
				&.last{
					width: 380rpx;
				}
			}			
		}
		.btns-col{
			position: absolute;
			bottom: 300rpx;
			left: 50rpx;
			.btn{
				margin-top: 20rpx;
				background-color: $uni-theme-bg-color;
				width: auto;
				padding:6rpx 20rpx;
				border-radius: 0 200rpx 140rpx 0;
				&:last-child{
					margin-left: 50rpx;
				}
			}
		}
	}	
</style>
