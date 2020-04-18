<template>
	<view class="tabs">
		<view v-for="(item, index) in values" :key="index" :class="['tabs-item', { active: index === currentIndex }]" @click="onClickTabItem(index)">{{ item }}</view>
	</view>
</template>

<script>
export default {
	name: 'Tabs',
	props: {
		current: {
			type: Number,
			default: 0
		},
		values: {
			type: Array,
			default() {
				return [];
			}
		},
		activeColor: {
			type: String,
			default: '#3C3A29'
		},
		color: {
			type: String,
			default: '#ffffff'
		}
	},
	data() {
		return {
			currentIndex: 0
		};
	},
	watch: {
		current(val) {
			if (val !== this.currentIndex) {
				this.currentIndex = val;
			}
		}
	},
	created() {
		this.currentIndex = this.current;
	},
	methods: {
		onClickTabItem(index) {
			if (this.currentIndex !== index) {
				this.currentIndex = index;
				this.$emit('clickItem', index);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.tabs {
	display: flex;
	width: 750rpx;
	height: 75rpx;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	background: $uni-theme-bg-color;	
	z-index: 10;
	.tabs-item {
		width: 120rpx;
		font-size: 32rpx;
		font-weight: 600;
		height: 75rpx;
		line-height: 75rpx;
		text-align: center;
		border-bottom: 8rpx solid transparent;
		box-sizing: border-box;
		color: #3d3d3d;
		&.active {
			border-color: $uni-theme-active-tab-font-color;
			color: #000;
		}
	}
}
</style>
