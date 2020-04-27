<template>
	<view class="category-col">
		<tabs class="tabs-col" :current="currentCategoryType" :values="items" @clickItem="handleTabsItem"></tabs>
		<scroll-view class="category-scroll" scroll-y="true" :style="getScrollHeight">
			<view class="expend-category-col" v-if="currentCategoryType === 0">
				<loading v-if="expendCategoryLoading" />
				<view v-else>
					<view class="category-item" v-for="(categorys, index) in expendCategoryList" :key="index" :data-id="categorys._id" @click="handleDeleteCategory(categorys,index)">
						<view class="icon-col delete-btn"><view class="icon iconfont">&#xe6ed;</view></view>
						<view class="icon-col"><view class="icon iconfont" v-html="categorys.icon"></view></view>
						{{ categorys.name }}
					</view>
				</view>
			</view>
			<view class="income-category-col" v-else>
				<loading v-if="incomeCategoryLoading" />
				<view v-else>
					<view class="category-item" v-for="(categorys, index) in incomeCategoryList" :key="index" :data-id="categorys._id" @click="handleDeleteCategory(categorys,index)">
						<view class="icon-col delete-btn"><view class="icon iconfont">&#xe6ed;</view></view>
						<view class="icon-col"><view class="icon iconfont" v-html="categorys.icon"></view></view>
						{{ categorys.name }}
					</view>
				</view>				
			</view>
		</scroll-view>
		<view class="bottom-btn" @click="handleAddCategory">+添加类别</view>
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
			expendCategoryList: [],
			incomeCategoryList:[],
			expendCategoryLoading:true,
			incomeCategoryLoading:true,
			items: ['支出', '收入'],
			currentCategoryType: 0
		};
	},
	onLoad(options) {
		this._db = app.globalData.wxDB;
		this.currentCategoryType = options.categoryType || 0;
	},
	onShow() {
		this.getExpendCategoryList();
		const _self = this;
		getElement('.tabs-col').then(e => {
			uni.getSystemInfo({
				success: function(res) {
					_self.scrollHeight = res.windowHeight - e.height;
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
		getCategoryList(){
			const type = Number(this.currentCategoryType)
		    return	wx.cloud.callFunction({
				name: 'getCategoryList',
				data: {
					type,
					_openid:uni.getStorageSync('user.openid')
				}
			})
		},
		getIncomeCategoryList() {
			this.incomeCategoryLoading = true
			this.getCategoryList().then(({ result }) => {
				this.incomeCategoryList = result.data;
				setTimeout(_=>{
					this.incomeCategoryLoading = false
				},3000)
			})
			.catch(console.error);
		},
		getExpendCategoryList() {
			this.expendCategoryLoading= true
			this.getCategoryList().then(({ result }) => {
				this.expendCategoryList = result.data;
				setTimeout(_=>{
					this.expendCategoryLoading = false
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
						const typeArr = ['expend','income']
						_self[`${typeArr[_self.currentCategoryType]}CategoryList`].splice(index,1)
						_self.deleteCategoryCorrelationData(categorys._id);
					}
				}
			});
		},
		handleTabsItem(index) {
			if (this.currentCategoryType !== index) {
				this.currentCategoryType = index;
				if(index === 0 && this.expendCategoryList.length === 0){
					this.getExpendCategoryList()
				}else if(index === 1 && this.incomeCategoryList.length === 0){
					this.getIncomeCategoryList()
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
