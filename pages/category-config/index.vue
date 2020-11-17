<template>
	<view class="category-col">
		<tabs class="tabs-col" :current="currentCategoryType" :values="items" @clickItem="handleTabsItem"></tabs>
		<scroll-view class="category-scroll" scroll-y="true" :style="getScrollHeight">
			<view>
				<loading v-if="loading" />
				<view v-else>
					<view class="category-item" v-for="(categorys, index) in getSocietyCategoryList" :key="index" :data-id="categorys._id" @click="handleDeleteCategory(categorys,index)">
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
			loading:true,
			items: ['支出', '收入'],
			currentCategoryType: 0
		};
	},
	onLoad(options) {
		this.DB = app.globalData.wxDB;
		this.currentCategoryType = options.categoryType || 0;
	},
	onShow() {		
		this.getCategoryList()
	},
	computed: {
		getSocietyCategoryList(){
			return Number(this.currentCategoryType) === 0? this.expendCategoryList:this.incomeCategoryList
		}
	},
	methods: {
		getCategoryList(){
			// this.expendCategoryList = this.$store.getters.categoryExpendList,this.incomeCategoryList = this.$store.getters.categoryIncomeList
			
			this.DB.collection(this.$conf.database.Category).where({
				_openid:this.getOpenid
			}).get().then(({data})=>{
				if(data.length > 0){
					const { expends,incomes } = data[0]
					this.expendCategoryList = expends
					this.incomeCategoryList = incomes
					this.$store.commit('SET_CATEGORYEXPENDLIST',expends) //支出
					this.$store.commit('SET_CATEGORYINCOMELIST',incomes) //收入
					this.calculateScrollHeight();
				}
				setTimeout(_=>{
					this.loading = false
				},1000)
			})
		},
		deleteCategory(categoryId,type,index){
			const listName = ['expends','incomes'][type]
			,DB_Category = this.DB.collection(this.$conf.database.Category)
			
			DB_Category.where({
				_openid:this.getOpenid
			}).get().then(res=>{
				if(res.data.length > 0){
					let data = {}
					data[listName] = res.data[0][listName]
					data[listName].splice(index,1)
					
					DB_Category.doc(res.data[0]._id).update({
						data
					}).then(res=>{
						let typeCode1 = 'INCOME',typeCode2 = 'Income'
						if(type === 0){
							typeCode1 = 'EXPEND'
							typeCode2 = 'Expend'
						}
						let list = this.$store.getters[`category${typeCode2}List`]
						list.splice(index,1)
						this.$store.commit(`SET_CATEGORY${typeCode1}LIST`,list)
					})
				}
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
						_self.deleteCategory(categorys._id,Number(_self.currentCategoryType),index);
					}
				}
			});
		},
		handleTabsItem(index) {
			if (this.currentCategoryType !== index) {
				this.currentCategoryType = index
				if(this.expendCategoryList.length === 0 || this.incomeCategoryList.length === 0){
					this.getCategoryList()
				}
			}
		},
		handleAddCategory() {
			uni.navigateTo({
				url: '../icon-manage/index?categoryType=' + this.currentCategoryType
			});
		},
		calculateScrollHeight(){
			const _self = this;
			getElement('.tabs-col').then(e => {
				uni.getSystemInfo({
					success: function(res) {
						_self.scrollHeight = res.windowHeight - e.height + 50;
					}
				});
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
