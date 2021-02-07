<template>
	<view class="home">
		<view class="header">
			<view class="info">
				<view class="head"></view>
				<text>帅破川穹</text>
			</view>
			<!-- 记账统计 -->
			<view class="statistics">
				<view>
					<text>1</text>
					<view class="label">已连续打卡</view>
				</view>
				<view>
					<text>1</text>
					<view class="label">记账总天数</view>
				</view>
				<view>
					<text>10</text>
					<view class="label">记账总笔数</view>
				</view>
			</view>
		</view>
		<view class="panels">
			<koi-panel title="账单" />
		</view>
	</view>
</template>

<script>
const app = getApp();
import KoiPanel from '@/components/koi-panel.vue'
export default {
	components: {
		KoiPanel
	},
	data() {
		return {
		}
	},
	onLoad() {
		const _self = this
		wx.cloud
		.callFunction({
			name: 'login'
		})
		.then(res => {
			uni.setStorageSync(_self.$conf.storageKey.openid, res.result.openid);
			wx.getSetting({
				success: function(res) {
					const isAuthSetting = res.authSetting['scope.userInfo'] !== undefined && res.authSetting['scope.userInfo'] !== false;				
					uni.setStorageSync(_self.$conf.storageKey.isAuthSetting,isAuthSetting)
					if(isAuthSetting){
						wx.getUserInfo({
							success: function(res) {
								uni.setStorageSync(_self.$conf.storageKey.userInfo, res.userInfo)
								_self.updateUserInfo()
							}
						});
					}
				},
				fail: function(err) {
					_self.showNetworkIsError()
					console.error(err)
				}
			});
		});
	},
	onShow() {
	},
	computed: {
	},
	methods: {
		//分享好友
		onShareAppMessage(){
			return {
				title:'喵喵快速记账~',
				imageUrl: '/static/image/miao.png'
			}
		},
		//跳转页面
		navigateTo(e) {
		}
	}
};
</script>
<style lang="scss" scoped>
	.home{
		.header{
			background-color: $uni-theme-color;
			border-radius: 0 0 10% 10%;
			padding: 10upx 40upx 80upx;
			.info{
				display: flex;
				align-items: center;
				.head{
					border: 1px solid #fff;
					border-radius: 50%;
					height: 120upx;
					width: 120upx;
					margin-right: 10upx;
				}
			}
			.statistics{
				width: 680upx;
				margin: 60upx auto 0;
				display: flex;
				>view{
					flex: 1;
					text-align: center;
					text{
						font-size: 40upx;
						font-weight: 600;
					}
					.label{
						font-size: 25upx;
					}
				}
			}
		}
		.panels{
			padding:0 30upx;
			margin-top: -46upx;
		}
	}
</style>
