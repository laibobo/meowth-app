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
export default {
	data() {
		return {
			isFocus: false,
			categoryType: null,
			categoryName: '',
			scrollHeight: 375,
			activeValue: '&#xe67e;',
			iconList: [
				{
					name: '娱乐',
					icons: [
						'&#xe67e;',
						'&#xe677;',
						'&#xe641;',
						'&#xe644;',
						'&#xea76;',
						'&#xe608;',
						'&#xe609;',
						'&#xe635;',
						'&#xe697;',
						'&#xe61c;',
						'&#xe60f;',
						'&#xe743;',
						'&#xe62f;',
						'&#xe658;',
						'&#xe60a;',
						'&#xe675;',
						'&#xe670;',
						'&#xe636;'
					]
				},
				{
					name: '饮食',
					icons: [
						'&#xe70d;',
						'&#xe6aa;',
						'&#xe668;',
						'&#xe63c;',
						'&#xe60e;',
						'&#xe624;',
						'&#xe66e;',
						'&#xe6a3;',
						'&#xe65e;',
						'&#xe66c;',
						'&#xe6ab;',
						'&#xe6a0;',
						'&#xe6a4;',
						'&#xe665;',
						'&#xe640;',
						'&#xe692;',
						'&#xe614;',
						'&#xe605;',
						'&#xe6ac;',
						'&#xe66a;',
						'&#xe6b3;',
						'&#xe6ad;',
						'&#xe601;',
						'&#xe688;',
						'&#xe9ce;'
					]
				},
				{
					name: '购物',
					icons: [
						'&#xe8e1;',
						'&#xe69a;',
						'&#xe62c;',
						'&#xe69d;',
						'&#xe63b;',
						'&#xe657;',
						'&#xe666;',
						'&#xe6a6;',
						'&#xe6a5;',
						'&#xe6d9;',
						'&#xe6da;',
						'&#xe643;',
						'&#xe6de;',
						'&#xe633;',
						'&#xe6dc;',
						'&#xe686;',
						'&#xe65b;',
						'&#xe65a;',
						'&#xe61a;',
						'&#xe664;',
						'&#xe6c7;',
						'&#xe6ca;',
						'&#xe6cb;',
						'&#xe607;',
						'&#xe689;',
						'&#xe63d;',
						'&#xe6db;',
						'&#xe6c5;',
						'&#xe6c4;',
						'&#xe622;'
					]
				},
				{
					name: '交通',
					icons: [
						'&#xe6e2;',
						'&#xe739;',
						'&#xe68b;',
						'&#xe6a9;',
						'&#xe618;',
						'&#xe6a2;',
						'&#xe67d;',
						'&#xe67f;',
						'&#xe68c;',
						'&#xe626;',
						'&#xe6c3;',
						'&#xe61f;',
						'&#xe6a8;'
					]
				},
				{
					name: '医疗',
					icons: ['&#xe64d;', '&#xe647;', '&#xe638;', '&#xe68d;', '&#xe6f1;', '&#xe6b2;']
				},
				{
					name: '学习',
					icons: [
						'&#xe69b;',
						'&#xe671;',
						'&#xe69f;',
						'&#xe60b;',
						'&#xe758;',
						'&#xe64c;',
						'&#xe663;',
						'&#xe6c9;',
						'&#xe6b8;',
						'&#xe709;',
						'&#xe667;',
						'&#xe6b5;',
						'&#xe6b4;'
					]
				},
				{
					name: '办公',
					icons: ['&#xe693;', '&#xe64b;', '&#xe6a7;', '&#xe61d;', '&#xe61b;', '&#xe652;', '&#xe6f5;']
				},
				{
					name: '生活家居',
					icons: [
						'&#xe6c0;',
						'&#xe6c2;',
						'&#xe6be;',
						'&#xe6c1;',
						'&#xe9e2;',
						'&#xe9d3;',
						'&#xe9ca;',
						'&#xe610;',
						'&#xe617;',
						'&#xe679;',
						'&#xe698;',
						'&#xe6bd;',
						'&#xe750;',
						'&#xe630;',
						'&#xe676;',
						'&#xe67a;',
						'&#xe6bc;',
						'&#xe6bb;',
						'&#xe6ba;',
						'&#xe60d;',
						'&#xe69c;',
						'&#xe606;',
						'&#xe7fd;',
						'&#xe612;',
						'&#xe616;'
					]
				},
				{
					name: '家庭',
					icons: [
						'&#xe656;',
						'&#xe655;',
						'&#xe600;',
						'&#xe628;',
						'&#xe681;',
						'&#xe68f;',
						'&#xe68e;',
						'&#xe629;',
						'&#xe621;',
						'&#xe634;',
						'&#xe6d4;',
						'&#xe6d2;',
						'&#xe6d1;',
						'&#xe6cd;',
						'&#xe6d5;',
						'&#xe737;',
						'&#xe6d0;',
						'&#xe6cf;'
					]
				},
				{
					name: '个人',
					icons: ['&#xe7ff;', '&#xe645;', '&#xe623;', '&#xe653;', '&#xe67c;', '&#xe602;', '&#xe632;']
				},
				{
					name: '收入',
					icons: ['&#xe65d;', '&#xe696;', '&#xe6bf;', '&#xe615;', '&#xe625;', '&#xe63e;', '&#xe60c;', '&#xe620;', '&#xe672;', '&#xe674;', '&#xe682;', '&#xe651;']
				},
				{
					name: '其他',
					icons: ['&#xe66d;', '&#xe669;', '&#xe6d7;', '&#xe719;', '&#xe690;', '&#xe648;', '&#xe64a;', '&#xe649;', '&#xe62e;', '&#xe661;', '&#xe65c;', '&#xe62b;']
				}
			]
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
			const type = Number(this.categoryType);
			const icon = this.activeValue;
			const name = this.categoryName;
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
	background: red !important;
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
		background: green;
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
