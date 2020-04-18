<template>
	<view 
		:style="{backgroundColor:visible?`rgba(0,0,0,${opacity})`:'rgba(0,0,0,0)'}" 
		:class="['modal',{ show: visible }]">
		<view class="dialog__wrapper">
			<view class="header">
				<text>{{title}}</text>
			</view>
			<view class="body">
				<slot></slot>
			</view>
			<view class="footer" :style="{'justify-content':getBtnLocation}">
				<button @click.stop="onCancel">{{cancelBtnTxt}}</button>
				<button @click.stop="onAffirm">{{affirmBtnTxt}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'Dialog',
		props:{
			visible:{
				type:Boolean,
				default:false
			},
			title:{
				type:String,
				default:'标题'				
			},
			cancelBtnTxt:{
				type:String,
				default:'取消'
			},
			affirmBtnTxt:{
				type:String,
				default:'确认'
			},
			btnLocation:{
				type:String,
				default:'right'
			},
			opacity:{
				type:Number,
				default:0.6
			}
		},
		computed:{
			getBtnLocation(){
				return this.btnLocation == 'left'?'flex-start': this.btnLocation == 'right'?'flex-end':'center'
			}
		},
		methods:{
			onCancel(){
				this.$emit('update:visible', false)
				this.$emit('cancel')
			},
			onAffirm(){
				this.$emit('affirm')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modal{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9999;
		transition: background 0.3s linear;
		display: flex;
		align-items: center;
		opacity: 0;
		visibility: hidden;
		justify-content: center;
		&.show{
			visibility:visible;
			opacity: 1;
		}
		.dialog__wrapper{
			width: 600rpx;
			font-weight: 400;
			font-size: 18px;
			background-color: #fff;
			border-radius: 6rpx;
			box-sizing: border-box;
			.header{
				height: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;				
			}
			.body{
				padding:50rpx 20rpx;
			}
			.footer{
				display: flex;
				align-items: center;
				padding: 0 40rpx 30rpx;				
				button{
					display: block;
					width: 300rpx;
					height: 60rpx;
					line-height: 60rpx;
					margin: 0 10rpx;
					font-size: 24rpx;
					padding: 0;
					font-weight: 600;
					letter-spacing: 2rpx;
					&:last-child{
						background-color: #ffd74c;
					}
				}
			}
		}
	}
</style>
