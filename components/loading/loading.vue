<template>
	<view class="lds-ellipsis">
		<view></view>
		<view></view>
		<view></view>
		<view></view>
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
.lds-ellipsis {
  position: relative;
  display:block;
  width: 125rpx;
  height: 20rpx;
  left: 50%;
  margin-left: -66rpx;
  view {
	position: absolute;
	top: 0;
	width: 20rpx;
	height: 20rpx;
	border-radius: 10rpx;
	background: #C0C0C0;
	animation-timing-function: cubic-bezier(0, 1, 1, 0);
	&:nth-child(1) {
	  left: 16rpx;
	  animation: lds-ellipsis1 0.6s infinite;
	}
	&:nth-child(2) {
	  left: 16rpx;
	  animation: lds-ellipsis2 0.6s infinite;
	}
	&:nth-child(3) {
	  left: 64rpx;
	  animation: lds-ellipsis2 0.6s infinite;
	}
	&:nth-child(4) {
	  left: 112rpx;
	  animation: lds-ellipsis3 0.6s infinite;
	}
  }
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(48rpx, 0);
  }
}

</style>
