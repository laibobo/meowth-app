<template>
	<view v-if="visible" class="remark-panel">
		<view class="header">
			<view 
				class="icon iconfont cancel-btn"
				@click="handleCancelRemark">&#xe6e7;</view>
			<text>请添加备注</text>
			<text class="confirm-btn" @click="handleConfirmRemark">确定</text>
		</view>
		<view class="input-col">
			<input 
				placeholder="请输入备注内容"
				:value="content"
				cursor-spacing="50"
				:maxlength="maxLength"
				:focus="isRemarkFocus"
				@input="handleInputRemark" />
		</view>
		<view class="hint">{{ getContentLength }}/{{ maxLength  }}</view>
	</view>	
</template>

<script>
	/**
	 * 备注面板
	 * visible 是否显示，支持 .sync 修饰符
	 * content 内容
	 * maxLength 内容的最大长度
	 * @confirm  确认事件
	 * @close 关闭事件
	 * */
	export default {
		name:'remark-panel',
		props:{
			visible:{
				type:Boolean,
				default:false
			},
			content:{
				type:String,
				default:''
			},
			maxLength:{
				type:Number,
				default:30
			},
		},	
		data() {
			return {
				fontNumber:0,
				remark:'',
				isRemarkFocus:true
			}
		},
		computed:{
			getContentLength(){
				return this.remark!==''?this.remark.length:this.content.length
			}
		},
		methods: {
			handleCancelRemark() {
				this.isRemarkFocus = false
				this.remark = ''
				this.fontNumber = 0
				this.$emit('update:visible',false)
				this.$emit('close')
			},
			handleConfirmRemark(){
				this.$emit('confirm',this.remark)
				this.handleCancelRemark()
			},
			handleInputRemark(e){
				const remark = e.detail.value;
				if (this.maxLength < remark.length) {
					return;
				}
				this.fontNumber = remark.length;
				this.remark = remark;
			}
		}
	}
</script>

<style lang="scss" scoped>
.remark-panel {
	width: 750rpx;
	height: auto;
	padding: 20rpx 40rpx 150rpx;
	box-sizing: border-box;
	display: flex;
	background: #fff;
	border-radius: 20rpx;
	flex-direction: column;
	position: fixed;
	left: 0;
	bottom: 0;
	border-top: 1px solid #eee;
	.header {
		display: flex;
		justify-content: space-between;
		font-size: 32rpx;
		letter-spacing: 1rpx;
		align-items: center;
		.confirm-btn {
			color: #4eb27b;
		}
	}
	.input-col {
		margin: 60rpx 0 0;
		border-bottom: 1rpx solid #eeeeee;
		padding-bottom: 25rpx;
		color: #333333;
		font-size: 32rpx;
	}
	.hint {
		display: block;
		font-size: 24rpx;
		color: DBDBDB;
		margin: 20rpx 0 0;
	}
}
</style>
