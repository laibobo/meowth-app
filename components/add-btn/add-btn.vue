<template>
	<button class="add-keep-btn" hover-class="hoverstatus" @click="onClick"></button>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		methods:{
			onClick(){
				if(this.$authorize()){
					uni.navigateTo({
						url:'../../pages/keep-accounts/index'
					})
				}				
			}
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes glow {
	    0% {
	        border-color: #FFDB45;
	        box-shadow: 0 0 5px rgba(255,219,69,.2), inset 0 0 5px rgba(255,219,69,.1), 0 1px 0 #FFDB45;
	    }
	    100% {
	        border-color: #FFA500;
	        box-shadow: 0 0 20px rgba(255,165,0,.6), inset 0 0 10px rgba(255,165,0,.4), 0 1px 0 #FFA500;
	    }
}
	.add-keep-btn{
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		background: #FFDB45;
		color: #3A3A21;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48rpx;
		animation: glow 800ms ease-out infinite alternate;
		&::before{
			content: '+';
		}
		&::after{
			display: none !important;
		}
		&.hoverstatus{
			//background: url(../../static/image/paw.png) no-repeat center center !important;
		}
	}
</style>
<style>
	
</style>
