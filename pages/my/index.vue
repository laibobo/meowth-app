<template>
	<view>
		<view class="header">
			<view class="userinfo" data-url="./account" @click="navigateTo">
				<image :src="photoUrl" :fade-show="false" mode="aspectFit"></image>
				<text>{{ nickName }}</text>
			</view>
			<view class="statistic">
				<view>
					<text>{{ sumDay }}</text>
					<text>记账总天数</text>
				</view>
				<view>
					<text>{{ sumLog }}</text>
					<text>记账总笔数</text>
				</view>
			</view>
		</view>
		<view class="tool">
			<view class="t-item" data-url="../invoice/index" @click="navigateTo">
				<view class="icon-col"><view class="icon iconfont">&#xe71a;</view></view>
				<text>发票助手</text>
			</view>
		</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			photoUrl: '',
			nickName: '',
			sumDay: '--',
			sumLog: '--'
		};
	},
	onShow() {
		const userInfo = uni.getStorageSync('user.info') || {};
		this.nickName = userInfo.nickName;
		const _self = this;
		if (userInfo.isCustomPhoto) {
			wx.cloud.downloadFile({
				fileID: userInfo.avatarUrl,
				success: res => {
					_self.photoUrl = res.tempFilePath;
				},
				fail: console.error
			});
		} else {
			this.photoUrl = userInfo.avatarUrl;
		}
		this.getKeepAccountsInfo();
	},
	methods: {
		navigateTo(e) {
			const url = e.currentTarget.dataset.url;
			uni.navigateTo({
				url
			});
		},
		getKeepAccountsInfo() {
			const db = app.globalData.wxDB;
			const $ = db.command.aggregate;
			const _od = db
				.collection('AccountsRecord')
				.aggregate()
				.match({
					_openid: uni.getStorageSync('user.openid')
				});
			_od.group({
				_id: '$keepDate'
			})
				.end()
				.then(res => {
					this.sumDay = res.list.length;
				});
			_od.group({
				_id: '$createDate'
			})
				.end()
				.then(res => {
					this.sumLog = res.list.length;
				});
		}
	}
};
</script>
<style lang="scss" scoped>
.tool {
	background: #fff;
	padding: 40rpx;
	margin-top: 20rpx;
	.t-item {
		width: 100rpx;
		height: auto;
		text-align: center;
		.icon-col {
			background: #f8f8f8;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.iconfont {
				color: #000;
			}
		}
		text {
			font-size: 24rpx;
			color: #333;
		}
	}
}
.header {
	background: #fff;
	.userinfo {
		margin: 0 40rpx;
		border-bottom: 2rpx solid $uni-border-color;
		padding: 40rpx 0;
		box-sizing: border-box;
		color: #333;
		image {
			width: 120rpx;
			height: 120rpx;
			border-radius: 60rpx;
			vertical-align: middle;
			margin-right: 40rpx;
		}
	}
	.statistic {
		display: flex;
		padding: 40rpx 0 20rpx;
		> view {
			flex: 1;
			text-align: center;
			> text {
				display: block;
				font-size: 24rpx;
				&:last-child {
					color: #565656;
				}
			}
		}
	}
}
</style>
