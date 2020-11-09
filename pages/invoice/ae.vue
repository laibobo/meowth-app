<!-- 添加/编辑 发票信息 -->
<template>
	<view class="col">
		<form @submit="formSubmit">
			<view class="uni-form-item uni-column">
				<view class="title">名称</view>
				<input class="uni-input" name="companyName" maxlength="35" placeholder="公司名称(必填)" :value="form.companyName" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">税号</view>
				<input class="uni-input" name="tfn" minlength="15" maxlength="20" placeholder="15-20位税号" :value="form.tfn" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">单位地址</view>
				<input class="uni-input" name="companyAddr" placeholder="公司地址" :value="form.companyAddr" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">电话号码</view>
				<input class="uni-input" name="tel" placeholder="公司电话" :value="form.tel" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">开户银行</view>
				<input class="uni-input" name="bankOfDeposit" placeholder="开户银行" :value="form.bankOfDeposit" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">银行账号</view>
				<input class="uni-input" name="bankAccount" placeholder="银行账号" :value="form.bankAccount" />
			</view>
			<view class="uni-btn-v">
				<button form-type="submit" hover-class="btnhover">保存</button>
				<button class="del-btn" v-if="isEdit" @click="handleDel" hover-class="btnhover">删除</button>
			</view>
		</form>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			form:{
				companyName:'',
				tfn:'',
				companyAddr:'',
				tel:'',
				bankOfDeposit:'',
				bankAccount:'',
				_id:''
			},
			isEdit:false,
			DB:null
		};
	},
	onLoad(option){
		if(option.item !== undefined){
			this.form = JSON.parse(decodeURIComponent(option.item));
			this.isEdit = true
		}
		this.DB = app.globalData.wxDB
	},
	methods: {
		handleDel:function(){
			const _self = this
			uni.showModal({
				title:'提示',
				content:'确认删除该发票信息？',
				success:function(result){
					if(result.confirm){
						uni.showLoading({
							title:'删除中...'
						})
						_self.deleteInvoice()
					}
				}
			})
		},
		deleteInvoice(){
			this.DB.collection(this.$conf.database.InvoiceManage).doc(this.form._id).remove({
				success:function(res){
					if(res.errMsg === 'document.remove:ok'){
						uni.showToast({
							title:'删除成功',
							icon:'success'
						})
						setTimeout(_=>{
							uni.navigateBack({
								delta: 1
							})
						},1000)
					}
				}
			})
		},
		formSubmit: function(e) {
			const data = e.detail.value,
				tfnRule = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
			if (data.companyName == '') {
				uni.showToast({
					title: '请输入公司名称',
					icon: 'none',
					position: 'bottom'
				});
				return false;
			} else if (data.tfn != '' && !tfnRule.test(data.tfn)) {
				uni.showToast({
					title: '请输入正确的税号',
					icon: 'none',
					position: 'bottom'
				});
				return false;
			}
			uni.hideLoading({
				title:'保存中...'
			})
			const db_invoiceManage = this.DB.collection(this.$conf.database.InvoiceManage)
			if(this.isEdit){
				db_invoiceManage.doc(this.form._id)
					.update({
						data:{
							companyName:data.companyName,
							bankAccount:data.bankAccount,
							bankOfDeposit:data.bankOfDeposit,
							companyAddr:data.companyAddr,
							tel:data.tel,
							tfn:data.tfn
						}
					}).then(result=>{
						this._opts()	
					}).catch(err=>{
						this.showNetworkIsError()
						console.error(err)
					})
			}else{
				db_invoiceManage
					.add({
						data: data
					})
					.then(res => {
						this._opts()					
					})
					.catch(err=>{
						this.showNetworkIsError()
						console.error(err)
					});
			}
		},
		_opts(){
			uni.showToast({
				title:'保存成功',
				icon:'success'
			})
			setTimeout(_=>{
				uni.navigateBack({
					delta: 1
				})	
			},1000)	
		}
	}
};
</script>

<style lang="scss">
.col {
	margin-top: 40rpx;
	.btnhover{
		color: $uni-btn-hover-color !important;
	}
	.uni-form-item {
		background: #fff;
		padding: 20rpx;
		display: flex;
		.title {
			width: 180rpx;
		}
		.uni-input {
			width: 510rpx;
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
			&.del-btn{
				background: #eee !important;
				color: #333;
				&::after {
					border: 2rpx solid #ccc;
				}
			}
		}
	}
}
</style>
