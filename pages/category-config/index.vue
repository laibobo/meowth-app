<template>
	<view class="category-col">
		<tabs class="tabs-col" :current="currentCategoryType" :values="items" @clickItem="handleTabsItem"></tabs>
		<loading v-if="isLoading && getCurrentCategoryTypeList.length === 0"></loading>
		<scroll-view class="category-scroll" scroll-y="true" :style="getScrollHeight" v-else>
			<view class="category-item" v-for="(categorys, index) in dataList" :key="index" :data-id="categorys._id" @click="handleDeleteCategory(categorys,index)">
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
			expenditureList: [],
			incomeList:[],
			dataList:[],
			items: ['支出', '收入'],
			currentCategoryType: 0,
			isLoading:true,
			typeArr:['expenditureList','incomeList']
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
		},
		getCurrentCategoryTypeList(){
			const type = this.typeArr[this.currentCategoryType]
			return this[type]
		}
	},
	methods: {
		getCategoryList() {
			this.isLoading = true
			wx.cloud
				.callFunction({
					name: 'getCategoryList',
					data: {
						type:Number(this.currentCategoryType),
						_openid:uni.getStorageSync('user.openid')
					}
				})
				.then(({ result }) => {
					setTimeout(_=>{
						const type =this.typeArr[this.currentCategoryType] 
						this[type] = result.data;
						this.dataList = this[type]
						this.isLoading = false
					},3000)
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
						console.info('删除类别成功')
					})
			})
		},
		handleDeleteCategory(categorys,index){
			const _self = this
			uni.showModal({
				title: '警告',
				content: '删除类别会同时删除该类别下的所有记账',
				success: function(res) {
					if (res.confirm) {
						const type =_self.typeArr[_self.currentCategoryType]
						_self[type].splice(index,1)
						_self.dataList = _self[type]
						_self.deleteCategoryCorrelationData(categorys._id);
					}
				}
			});
		},
		handleTabsItem(index) {
			if (this.currentCategoryType !== index) {
				this.currentCategoryType = index;
				const type =this.typeArr[index],typeList = this[type]
				if(typeList.length >0){
					this.dataList = typeList
				}else{
					this.getCategoryList()
				}	
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
		box-shadow: 1px 2px 5px #3d3d3d;
	}
	.category-scroll {
		background: #fff;
		box-sizing: border-box;
		padding: 75rpx 0 100rpx;
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
					color: #FED845;
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
.tabs-col{
	position: fixed;
	z-index: 10;
}
</style>
<style>
	page{
		background: #fff;
	}
</style>
