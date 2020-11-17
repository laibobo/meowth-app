<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view>
			<image :src="require('@/static/image/welcome.jpg')" class="welcome"></image>
			<view class="foot">
				<button class="bottom" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="getWxUserInfo">授权登录</button>				
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
			env: this.$conf.cloud_env
		});
		this.db = app.globalData.wxDB;
		const _self = this;
		//获取用户是否授权
		wx.getSetting({
			success: function(res) {
				_self.isAuthSetting = res.authSetting['scope.userInfo'] === undefined;
				if (!_self.isAuthSetting) {
					_self.saveUserInfo();
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
		getWxUserInfo() {
			const _self = this;
			wx.getUserInfo({
				success: function(res) {
					uni.setStorageSync(_self.$conf.storageKey.isAuthSetting,true)
					_self.saveUserInfo(res.userInfo);
				}
			});
		},
		saveUserInfo(userInfo) {
			this.db
				.collection(this.$conf.database.User)
				.where({
					_openid: this.getOpenId
				})
				.get()
				.then(({data}) => {
					if(data.length > 0){
						userInfo = data[0]
					}
					this.$store.commit('SET_USERINFO',userInfo)
					if (data.length === 0) {
						this.addUserInfo(userInfo)
						this.addDefaultCategorys()
					}
					uni.switchTab({
					    url: '/pages/my/index'
					})
				});
		},
		addUserInfo(userInfo) {
			const nowdate = new Date()
			this.db
				.collection(this.$conf.database.User)
				.add({
					data: {
						nickName: userInfo.nickName,
						gender: userInfo.gender,
						avatarUrl: userInfo.avatarUrl,
						imageFileId:'',
						weChat: userInfo.nickName,
						province: userInfo.province,
						city: userInfo.city,
						theme: 'mint-green',
						registerTime: nowdate.getTime(),
						registerYear: nowdate.getFullYear()
					}
				})
				.then(addRes => {
					console.log('添加用户信息成功！', addRes);
				})
				.catch(err => {
					this.showNetworkIsError()
					console.error(err)
				});
		},
		addDefaultCategorys(){
			const defaultCategorys = categorysData.defaultCategorysList
			this.db.collection(this.$conf.database.Category).add({
				data:{
					expends:defaultCategorys.expends,
					incomes:defaultCategorys.incomes
				}
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
