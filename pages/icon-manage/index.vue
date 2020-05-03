<template>
	<view>
		<view class="icon-form">
			<view class="icon-col active"><view class="icon iconfont" v-html="activeValue"></view></view>
			<input
				type="text"
				:class="[{ active: isFocus }]"
				:value="categoryName"
				placeholder="输入类别名称(不超过4个汉字)"
				maxlength="4"
				@focus="isFocus = true"
				@blur="isFocus = false"
				@input="handleCategoryName"
			/>
			<button @click="submit">完成</button>
		</view>
		<scroll-view class="icon-list" scroll-y="true" :style="getScrollHeight">
			<view class="icon-group" v-for="(item, index) in iconList" :key="index">
				<label class="title">{{ item.name }}</label>
				<view class="icon-group-list">
					<view :class="['icon-col', { active: iconCode === activeValue }]" v-for="iconCode in item.icons" :key="iconCode" @click="handleSelectIcon(iconCode)">
						<view class="icon iconfont" v-html="iconCode"></view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
const app = getApp();
const categorysData = require('@/public/data.json')
export default {
	data() {
		return {
			isFocus: false,
			categoryType: null,
			categoryName: '',
			scrollHeight: 375,
			activeValue: '&#xe67e;',
			iconList: categorysData.iconList
		};
	},
	onLoad(option) {
		this.categoryType = option.categoryType;
		const that = this;
		wx.getSystemInfo({
			success: function(res) {
				that.scrollHeight = res.windowHeight;
			}
		});
		this._db = app.globalData.wxDB;
	},
	computed: {
		getScrollHeight() {
			return `height:${this.scrollHeight}px;`;
		}
	},
	methods: {
		handleSelectIcon(iconCode) {
			this.activeValue = iconCode;
		},
		handleCategoryName(event) {
			this.categoryName = event.detail.value.trim();
		},
		submit() {
			const categoryName = this.categoryName.trim();
			if (categoryName == '') {
				uni.showToast({
					title: '请输入类别名称',
					icon: 'none'
				});
				return;
			}
			if (categoryName.length > 4) {
				uni.showToast({
					title: '类别名称不能超过4个字符',
					icon: 'none'
				});
				return;
			}
			const type = Number(this.categoryType),icon = this.activeValue,name = this.categoryName
			this._db
				.collection('Category')
				.add({
					data: {
						type,
						icon,
						name
					}
				})
				.then(res => {
					let typeCode1 = 'INCOME',typeCode2 = 'Income'
					if(type === 0){
						typeCode1 = 'EXPEND'
						typeCode2 = 'Expend'
					}
					let list = this.$store.getters[`category${typeCode2}List`]
					list.push({
						type,
						icon,
						name	
					})
					this.$store.commit(`SET_CATEGORY${typeCode1}LIST`,list)
					uni.navigateBack({
						delta: 1
					});
				});
		}
	}
};
</script>

<style lang="scss" scoped>
@mixin icon-col {
	width: 80rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	background-color: #f5f5f5;
	border-radius: 40rpx;
}
@mixin app-bg-theme {
	background: #FFD654 !important;
	.iconfont {
		color: #fff !important;
	}
}
view.active {
	@include app-bg-theme;
}
input.active {
	border-bottom-color: #ccc !important;
	transition: border-bottom-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
page {
	overflow: hidden;
}
.icon-form {
	display: flex;
	align-items: center;
	width: 760rpx;
	height: 100rpx;
	box-sizing: border-box;
	padding: 0 25rpx;
	border-bottom: 2rpx solid #eeeeee;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 10;
	background-color: #fff;
	box-shadow: 1px 1px 2px #eee;
	.icon-col {
		@include icon-col;
		width: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		border-radius: 50rpx;
		.iconfont {
			font-size: 28rpx !important;
		}
	}
	input[type='text'] {
		display: block;
		font-size: 28rpx;
		border-bottom: 1rpx solid #f5f5f5;
		width: 500rpx;
		margin: 0 20rpx;
	}
	button {
		padding: 0;
		margin: 0;
		width: 100rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		background: #56BD27;
		font-size: 24rpx;
		border: none;
		color: #fff;
		&::after {
			border: none !important;
		}
	}
}
.icon-list {
	height: 1000rpx;
	width: 750rpx;
	display: flex;
	flex-direction: column;
	padding: 0 8rpx;
	box-sizing: border-box;
	padding-top: 100rpx;
	padding-bottom: 40rpx;
	.icon-group {
		text-align: center;
		margin-top: 35rpx;
		.title {
			display: block;
			font-size: 28rpx;
			padding-bottom: 20rpx;
		}
		.icon-group-list {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-content: center;
			justify-content: space-between;
			.icon-col {
				margin: 14rpx;
				@include icon-col;
				width: 95rpx;
				height: 95rpx;
				border-radius: 95rpx;
				line-height: 95rpx;
				.iconfont {
					color: #000;
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
