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
const app = getApp();
	
export default {
	data() {
		return {
			expendCategoryList: [],
			incomeCategoryList:[],
			expendCategoryLoading:false,
			incomeCategoryLoading:false,
			items: ['支出', '收入'],
			currentCategoryType: 0
		};
	},
	onLoad(options) {
		
	},
	onShow() {
		
	},
	computed: {
	},
	methods: {
		
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
