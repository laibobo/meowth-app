<!-- 发票信息列表 -->
<template>
	<view class="list">
		<view class="info-chunk" @click="openEdit" v-for="(item, index) in rows" :key="index" :data-item="item">
			<view>{{ item.companyName }}</view>
			<text>税号：{{ item.tfn }}</text>
		</view>
		<view class="v-button" @click="openAdd" hover-class="btnhover">+ 添加发票信息</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			rows: []
		};
	},
	onShow() {
		uni.showLoading({
			title:'数据加载中...'
		})
		this.getInvoiceList();
	},
	methods: {
		getInvoiceList() {
			this.rows = [];
			app.globalData.wxDB
				.collection(this.$conf.database.InvoiceManage)
				.where({
					_openid: this.getOpenid
				})
				.get()
				.then(res => {
					if (res.errMsg == 'collection.get:ok') {
						this.rows = res.data;
					}
					uni.hideLoading()
				})
				.catch(err=>{
					this.showNetworkIsError()
					console.error(err)
				});
		},
		openAdd() {
			uni.navigateTo({
				url: './ae'
			});
		},
		openEdit(e) {
			uni.navigateTo({
				url: './ae?item='+encodeURIComponent(JSON.stringify(e.currentTarget.dataset.item)) 
			});
		}
	}
};
</script>

<style lang="scss" s>
.list {
	padding-bottom: 100rpx;
	.btnhover{
		color: $uni-btn-hover-color !important;
	}
	.info-chunk {
		margin: 20rpx;
		height: 140rpx;
		box-sizing: border-box;
		background: #fff;
		box-shadow: 2px 2px 2px #ccc;
		border-radius: 20rpx;
		padding: 20rpx 40rpx;
		color: #000;
		font-size: 28rpx;
		line-height: 50rpx;
		position: relative;
		overflow: hidden;
		text {
			color: #333;
		}
		&:before {
			content: ' ';
			display: block;
			width: 10rpx;
			height: 140rpx;
			background: #e62b30;
			left: 0;
			top: 0;
			position: absolute;
		}
	}
}
</style>
