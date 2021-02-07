<template>
	<view>
		
	</view>
</template>

<script>
	const app = getApp();
	export default {
		components: {
		},
		data() {
			return {
				rightIcon: '&#xe6ec;',
				sexArr: ['男', '女'],
				sex: 0,
				photoUrl: '',
				nickName: '',
				userTableId: '',
				isEditNiceName: false,
				editNiceName:''
			};
		},
		onLoad() {
			
		},
		methods: {
			
		}
	};
</script>

<style lang="scss" scoped>
	.info-list {
		>view {
			position: relative;
			width: 750rpx;
			height: 110rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;
			color: #333;
			padding: 0 30rpx;

			label {
				color: #000;
			}

			.v_s {
				margin-right: 40rpx;
			}

			.sex-picker {
				width: 500rpx;

				view {
					text-align: right;
				}
			}

			.iconfont {
				color: #333;
				margin-right: -10rpx;
				position: absolute;
				right: 30rpx;
			}

			&:before {
				content: '';
				position: absolute;
				left: 25rpx;
				bottom: -1rpx;
				width: 1400rpx;
				border-bottom: 1px solid #dcdcdc;
				transform-origin: 0 0;
				transform: scale(0.5, 0.5);
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;
			}

			.header {
				image {
					width: 70rpx;
					height: 70rpx;
					border-radius: 35rpx;
				}
			}
		}

		.nickname-input {
			text-align: right;
			padding-right: 30rpx;
		}
	}

	.nicename-dialog {
		input {
			border-bottom: 2rpx solid #C0C0C0;
			font-size: 28rpx;
			padding: 6rpx 0;
			color: #565656;

			&:focus {
				border-bottom-color: #ccc;
			}
		}
	}
</style>
