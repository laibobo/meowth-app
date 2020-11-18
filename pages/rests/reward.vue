<template>
	<view class="col">
		<text class="msg">喵喵~ 支持不要超过早餐费唷</text>
		<view>
			<label>微信</label>
			<image :src="require('@/static/image/wx.jpg')"></image>
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
	methods: {
		
	}
};
</script>
<style lang="scss" scoped>
	.col{
		padding: 20rpx;
		.msg{
			font-size: 35rpx;
			text-shadow:2px 5px 5px #FFDB45;
			color:red;
		}
		label{
			color: #565656;
			text-shadow:2px 5px 5px #FFDB45;
		}
		image{
			width: 500rpx;
			display: block;
			margin: 0 auto;
		}
	}
</style>
