<template>
	<view class="loading">
		<image :src="require('@/static/image/loading.gif')"></image>
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
	display: flex;
	justify-content: center;
	image{
		width: 750rpx;
		height: 600rpx;
	}
}
</style>
