<template>
	<view class="loading">
		<view class="image-col">
			<image :src="require('@/static/image/loading_cat.gif')"></image>
		</view>
	</view>	
</template>

<script>
	export default {
		name:'Loading',
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.loading{
	position: relative;
	width: 750rpx;
	height: 600rpx;
	>view{
		display: flex;
		justify-content: center;
	}
	.image-col{
		image{
			width: 480rpx;
			height: 480rpx;
		}
	}
	
}
</style>
