<template>
	<view class="col">
		<text>请留下您的建议或者反馈~</text>
		<form class="form">
			<view class="type-box">
				<label>类型：</label>
				<picker :value="type" @change="handleType" :range="typeRange">
					<text>{{getTypeRangeText}}</text>
				</picker>
				<image v-show="isShowImage" :src="require('@/static/image/tm.png')" class="tm-image"></image>
			</view>
			<view>
				<label>描述：</label>
				<textarea :value="content" placeholder="请输入内容" :maxlength="250" :auto-height="true" @input="handleContent" @focus="isShowImage=true" @blur="isShowImage=false"></textarea>
			</view>
		</form>
		
		<view class="uni-btn-v">
			<button form-type="submit" hover-class="btnhover" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
import { addFeedBack } from '@/public/api.js'
import { setSoundEffects } from '@/public/index.js';
export default {
	data() {
		return {
			typeRange:['反馈','建议'],
			type:'',
			content:'',
			isShowImage:false
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
		handleContent({detail}){
			this.content = detail.value
		},
		handleType({detail}){
			this.type = this.typeRange[Number(detail.value)]
		},
		submit(){
			setSoundEffects('click')
			if(!this.type){
				uni.showToast({
					title: '请选择类型',
					icon: 'none'
				})
				setSoundEffects('msg2')
				return
			}
			if(!this.content){
				uni.showToast({
					title: '请输入描述',
					icon: 'none'
				})
				setSoundEffects('msg2')
				return
			}
			
			addFeedBack({
				typeName:this.type,
				content:this.content
			}).then(res=>{
				this.type = ''
				this.content = ''
				uni.showToast({
					icon:'success',
					title:'提交成功~'
				})
			}).catch(err=>{
				this.showNetworkIsError()
				console.error(err)
			})
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
				position: relative;
			}
			textarea{
				border: 1rpx solid #ccc;
				padding: 20rpx;
				margin-top: 10rpx;
			}
			.tm-image{
				width: 100rpx;
				height: 100rpx;
				position: absolute;
				right: 20rpx;
				bottom: -40rpx;
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
