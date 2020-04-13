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
						const categorysList = [
							{"type":0,"icon":"\u0026#xe662;","name":"餐饮","sortnumber":0},
							{"type":0,"icon":"\u0026#xe8e1;","name":"购物","sortnumber":1},
							{"type":0,"icon":"\u0026#xe626;","name":"交通","sortnumber":2},
							{"type":1,"icon":"\u0026#xe677;","name":"电影","sortnumber":3},
							{"type":0,"icon":"\u0026#xe644;","name":"娱乐","sortnumber":4},
							{"type":0,"icon":"\u0026#xe66c;","name":"蔬菜","sortnumber":5},
							{"type":0,"icon":"\u0026#xe63c;","name":"水果","sortnumber":6},
							{"type":0,"icon":"\u0026#xe6ac;","name":"零食","sortnumber":7},
							{"type":0,"icon":"\u0026#xe666;","name":"服饰","sortnumber":8},
							{"type":0,"icon":"\u0026#xe632;","name":"通讯","sortnumber":9},
							{"icon":"\u0026#xe7ff;","name":"住房","type":0,"sortnumber":10},
							{"name":"美容","type":0,"icon":"\u0026#xe6de;","sortnumber":11},
							{"name":"日用","type":0,"icon":"\u0026#xe659;","sortnumber":12},
							{"type":0,"icon":"\u0026#xe60b;","name":"学习","sortnumber":13},
							{"type":0,"icon":"\u0026#xe6cd;","name":"宠物","sortnumber":14},
							{"type":0,"icon":"\u0026#xe67e;","name":"游戏","sortnumber":15},
							{"type":0,"icon":"\u0026#xe64d;","name":"医疗","sortnumber":16},
							{"name":"社交","type":0,"icon":"\u0026#xe645;","sortnumber":17},
							{"type":0,"icon":"\u0026#xe6c1;","name":"旅行","sortnumber":18},
							{"type":0,"icon":"\u0026#xe679;","name":"居家","sortnumber":19},
							{"type":0,"icon":"\u0026#xe653;","name":"公益","sortnumber":20},
							{"type":0,"icon":"\u0026#xe691;","name":"孩子","sortnumber":21},
							{"type":0,"icon":"\u0026#xe82d;","name":"亲友","sortnumber":22},
							{"name":"办公","type":0,"icon":"\u0026#xe652;","sortnumber":23},
							{"icon":"\u0026#xe620;","name":"其他","type":0,"sortnumber":24},
							{"type":1,"icon":"\u0026#xe65d;","name":"兼职","sortnumber":0},
							{"name":"礼金","type":1,"icon":"\u0026#xe651;","sortnumber":1},
							{"type":1,"icon":"\u0026#xe625;","name":"理财","sortnumber":2},
							{"type":1,"icon":"\u0026#xe615;","name":"工资","sortnumber":3},
							{"icon":"\u0026#xe620;","name":"其他","type":1,"sortnumber":4}]
						for(let i=0;i<categorysList.length;i++){
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
