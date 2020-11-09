<template>
	<view class="col">
		<text>请留下您的建议或者反馈~</text>
		<form class="form">
			<view class="type-box">
				<label>类型：</label>
				<picker :value="form.type" @change="handleType" :range="typeRange">
					<text>{{getTypeRangeText}}</text>
				</picker>
			</view>
			<view>
				<label>描述：</label>
				<textarea :value="content" placeholder="请输入内容" :maxlength="250" :auto-height="true"></textarea>
			</view>
		</form>
		
		<view class="uni-btn-v">
			<button form-type="submit" hover-class="btnhover" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			DB: null,
			typeRange:['反馈','建议'],
			type:'',
			content:''
		};
	},
	onLoad() {
	},
	computed:{
		getTypeRangeText(){
			return this.type?this.type:'请选择'
		}
	},
	methods:{
		handleType({detail}){
			this.type = this.typeRange[Number(detail.value)]
		},
		submit(){
			if(!this.type){
				uni.showToast({
					title: '请选择类型',
					icon: 'none'
				})
				return
			}
			if(!this.content){
				uni.showToast({
					title: '请输入描述',
					icon: 'none'
				})
				return
			}
			console.log(this.content)
		}
	}
};
</script>
<style lang="scss" scoped>
	.col{
		margin:100rpx 0;
		background-color: #fff;
		border-radius: 50rpx;
		padding: 20rpx 30rpx 50rpx;
		.form{
			display: block;
			margin-top: 70rpx;
			view{
				display: flex;
				label{
					width: 120rpx;
				}
				>*{
					flex: 1;
				}
			}
			.type-box{
				text{
					background-color: $uni-theme-bg-color;
					padding: 10rpx;
				}
				margin-bottom: 20rpx;
			}
			textarea{
				border: 1rpx solid #ccc;
				padding: 20rpx;
				margin-top: 10rpx;
			}
		}
		.uni-btn-v {
			margin: 100rpx 40rpx 0;
			button {
				background-color: $uni-theme-bg-color !important;
				color: #fff;
				margin-bottom: 20rpx;
				&::after {
					border: none;
				}
			}
			.btnhover{
				color: $uni-btn-hover-color !important;
			}
		}
	}
</style>
