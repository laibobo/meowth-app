<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view>
			<image :src="require('@/static/image/welcome.jpg')" class="welcome"></image>
			<view class="foot">
				<button class="bottom" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="getUserInfo">授权登录</button>				
			</view>
			<text class="miao"></text>
		</view>
		<!-- #endif-->
	</view>
</template>

<script>
const app = getApp();
const categorysData = require('@/public/data.json')
export default {
	data() {
		return {
			isAuthSetting: false
		};
	},
	onLoad() {
		app.globalData.wxDB = wx.cloud.database({
			env: 'develop-tm3ye'
		});
		this.db = app.globalData.wxDB;
		const _self = this;
		//获取用户是否授权
		wx.getSetting({
			success: function(res) {
				_self.isAuthSetting = res.authSetting['scope.userInfo'] === undefined;
				if (!_self.isAuthSetting) {
					_self.optUserInfo();
				}
			},
			fail: function(err) {
				console.error('查询是否授权失败！', err);
			}
		});
	},
	onShow(){
		 wx.hideHomeButton()
	},
	methods: {
		/**
		 * 获取微信用户信息
		 * */
		getUserInfo() {
			const _self = this;
			wx.getUserInfo({
				success: function(res) {
					uni.setStorageSync('user.info', res.userInfo);
					_self.optUserInfo();
					uni.setStorageSync('isAuthSetting',true)
				}
			});
		},
		optUserInfo() {
			this.db
				.collection('User')
				.where({
					_openid: uni.getStorageSync('user.openid')
				})
				.get()
				.then(userRes => {
					let userInfo = uni.getStorageSync('user.info') || {};
					if (userRes.data.length === 0) {
						this.addedUserInfo(userInfo);
						const categorysList = categorysData.defaultCategorysList
						for(let i=0,leng=categorysList.length;i<leng;i++){
							this.addDefaultCategorys(categorysList[i])
						}
					}
					uni.switchTab({
					    url: '/pages/my/index'
					})
				});
		},
		/**
		 * 添加用户信息
		 * */
		addedUserInfo(userInfo) {
			const nowdate = new Date();
			this.db
				.collection('User')
				.add({
					data: {
						nickName: userInfo.NickName,
						gender: userInfo.gender,
						avatarUrl: userInfo.avatarUrl,
						weChat: userInfo.NickName,
						province: userInfo.province,
						city: userInfo.city,
						theme: 'mint-green',
						registerTime: nowdate.getTime(),
						registerYear: nowdate.getFullYear(),
						isCustomPhoto: false,
						isCustomNickName: false
					}
				})
				.then(addRes => {
					console.log('添加用户信息成功！', addRes);
				})
				.catch(err => {
					console.error('添加用户信息失败！', err);
				});
		},
		addDefaultCategorys(data){
			this.db.collection('Category').add({
				data
			}).then(res => {
			  console.log(res)
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.miao{
	position: fixed;
	width: 200rpx;
	height: 100rpx;
	border-radius: 50% / 50%;
	top: 220rpx;
	right: 50rpx;
	border: 4rpx solid #f5f5f5;
	text-align: center;
	line-height: 100rpx;

	&::after{
		display: block;
		content: '喵~';
		font-size: 28rpx;
		color: #ccc;		
	}
	&::before{
		display: block;
		content: '';
		width: 50rpx;
		height: 10rpx;
		border: 4rpx solid #f5f5f5;
		border-radius: 50% / 50%;
		position: absolute;
		bottom: -50rpx;
		left: 20rpx;
	}
	
}
.welcome {
	width: 380rpx;
	height: 250rpx;
	position: fixed;
	left: 50%;
	top: 350rpx;
	margin-left: -190rpx;
}

.bottom {
	border-radius: 80rpx;
	font-size: 35rpx;
	color: #fff;
	background: $uni-theme-bg-color;
	width: 270rpx;
	z-index: 99;
	height: 80rpx;
	line-height: 80rpx;
	position: fixed;
	top: 650rpx;
	left: 50%;
	margin-left: -135rpx;
}
button{
	&::after{
		border: none !important;
	}
}

</style>
<style>
	page{
		background: #fff;
	}
</style>
