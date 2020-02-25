<template>
	<view class="category-col">
		<tabs class="tabs-col" :current="currentCategoryType" :values="items" @clickItem="handleTabsItem"></tabs>
		<scroll-view class="category-scroll" scroll-y="true" :style="getScrollHeight">
			<view class="category-item" v-for="(categorys, index) in dataList" :key="index" :data-id="categorys._id" @click="handleDeleteCategory">
				<view class="icon-col delete-btn"><view class="icon iconfont">&#xe6ed;</view></view>
				<view class="icon-col"><view class="icon iconfont" v-html="categorys.icon"></view></view>
				{{ categorys.name }}
			</view>
		</scroll-view>
		<view class="add-category-btn" @click="handleAddCategory">+添加类别</view>
	</view>
</template>

<script>
import Tabs from '@/components/tabs/tabs.vue';
import { getElement } from '@/public/index.js';
const app = getApp();
export default {
	components: { Tabs },
	data() {
		return {
			isRefreshData: false,
			dataList: [],
			items: ['支出', '收入'],
			currentCategoryType: 0
		};
	},
	onLoad(options) {
		const that = this;
		this._db = app.globalData.wxDB;
		this.currentCategoryType = options.categoryType || 0;
	},
	onShow() {
		this.getCategoryList();
		const that = this;
		getElement('.tabs-col').then(e => {
			uni.getSystemInfo({
				success: function(res) {
					that.scrollHeight = res.windowHeight - e.height;
				}
			});
		});
	},
	computed: {
		getScrollHeight() {
			return `height:${this.scrollHeight}px;`;
		}
	},
	methods: {
		getCategoryList() {
			const type = Number(this.currentCategoryType);
			wx.cloud
				.callFunction({
					name: 'getCategoryList',
					data: {
						type,
						openid:uni.getStorageSync('user.openid')
					}
				})
				.then(({ result }) => {
					this.dataList = result.data;
				})
				.catch(console.error);
		},
		deleteCategoryCorrelationData(categoryId){
			wx.cloud.callFunction({
				name:'deleteKeepAccounts',
				data:{
					categoryId,
					openid:uni.getStorageSync('user.openid')
				}
			}).then(({result})=>{
				this._db.collection('Category')
					.doc(categoryId)
					.remove()
					.then(res=>{
						if(res.errMsg.indexOf('ok') > -1){
							this.getCategoryList()
						}
					})
			})
		},
		handleDeleteCategory(e){
			const _self = this
			uni.showModal({
				title: '警告',
				content: '删除类别会同时删除该类别下的所有记账',
				success: function(res) {
					if (res.confirm) {
						_self.deleteCategoryCorrelationData(e.currentTarget.dataset.id);
					}
				}
			});
		},
		handleTabsItem(index) {
			if (this.currentCategoryType !== index) {
				this.currentCategoryType = index;
				this.getCategoryList();
			}
		},
		handleAddCategory() {
			uni.navigateTo({
				url: '../icon-manage/index?categoryType=' + this.currentCategoryType
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.category-col {
	.add-category-btn {
		background: #fff;
		width: 750rpx;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 10;
		font-size: 32rpx;
		border-top: 2rpx solid #eee;
		background: $uni-theme-bg-color;
		color: #fff;
	}
	.category-scroll {
		background: #fff;
		box-sizing: border-box;
		padding: 80rpx 0 100rpx;
		.category-item {
			padding: 20rpx 0;
			height: 100rpx;
			box-sizing: border-box;
			margin-left: 20px;
			display: flex;
			align-items: center;
			border-top: 2rpx solid #eee;
			.icon-col {
				width: 60rpx;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				background-color: #f5f5f5;
				border-radius: 30rpx;
				margin-left: 10rpx;
				margin-right: 20rpx;
				.icon {
					font-size: 35rpx;
				}
			}
			.delete-btn{
				background-color: initial;
				.icon {
					font-size: 50rpx;
					color: red;
				}
			}
		}
	}
}
</style>
<style>
	page{
		background: #fff;
	}
</style>
