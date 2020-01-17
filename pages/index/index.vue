<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="loading" v-if="loading">
			<image :src="require('@/static/image/loading.gif')"></image>
		</view>
		<view v-if="!isAuthSetting">
			<image :src="require('@/static/image/welcome.png')" class="welcome"></image>
			<button class="bottom" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="getUserInfo">开启记账之旅</button>
			<view class="fishpond">
				<image :src="require('@/static/image/01.jpg')" class="y1"></image>
			</view>
		</view>
		<!-- #endif-->
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				loading: true,
				isAuthSetting: true,
				userOpenId:''
			}
		},
		onLoad() {
			app.globalData.wxDB = wx.cloud.database({
				env: 'develop-tm3ye'
			})
			this.db = app.globalData.wxDB
			wx.cloud.callFunction({
				name: 'login'
			}).then(res => {
				uni.setStorageSync('user.openid', res.result.openid)
				this.userOpenId = res.result.openid
			})
			const _self = this
			//获取用户是否授权
			wx.getSetting({
				success: function(res) {
					setTimeout(_ => {
						_self.loading = false
						_self.isAuthSetting = res.authSetting['scope.userInfo'] !== undefined
						if (_self.isAuthSetting) {
							_self.optUserInfo()
						}
					}, 1500)
				},
				fail: function(err) {
					console.error('查询是否授权失败！', err)
				}
			})
		},
		methods: {
			/**
			 * 获取微信用户信息
			 * */
			getUserInfo() {
				const _self = this;
				wx.getUserInfo({
					success: function(res) {
						uni.setStorageSync('user.info',res.userInfo)
						_self.optUserInfo()
					}
				})
			},
			optUserInfo() {				
				this.db.collection('User').where({
					_openid: this.userOpenId
				}).get().then(userRes => {
					let userInfo = uni.getStorageSync('user.info') || {}
					if (userRes.data.length === 0) {
						this.addedUserInfo(userInfo)
					} else {
						this.updateUserInfo(userInfo,userRes)
					}
				})
			},
			/**
			 * 添加用户信息
			 * */
			addedUserInfo(userInfo){
				const nowdate = new Date()
				this.db.collection('User').add({
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
				}).then(addRes => {
					console.log('添加用户信息成功！', addRes)
				}).catch(err => {
					console.error('添加用户信息失败！', err)
				})
			},
			/**
			 * 更新用户信息
			 * */
			updateUserInfo(userInfo,userRes){
				const resData = userRes.data[0],data = {}
				//判断用户是否上传头像、更改昵称，如没有则获取微信数据设置
				if (!resData.isCustomPhoto) {
					data.avatarUrl = userInfo.avatarUrl
				}
				if (!resData.isCustomNickName) {
					data.nickName = userInfo.nickName
				}
				data.weChat = userInfo.NickName
				data.province = userInfo.province
				data.city = userInfo.city
				//data.gender = userInfo.gender
							
				this.db.collection('User').doc(resData._id).update({
					data
				}).then(updateRes=>{
					console.log('更新用户信息成功！',updateRes)
					this.getNewUserInfo()
				}).catch(err=>{
					console.error('更新用户信息成功:',err)
				})
			},
			/**
			 * 获取用户信息（数据库数据）
			 * */
			getNewUserInfo(){
				this.db.collection('User').where({
					_openid:this.userOpenId
				}).get().then(res=>{
					console.log('getNewUserInfo：',res.data)
					if(res.data.length > 0){
						uni.setStorageSync('user.info',res.data[0])
					}
					this.toSkip()
				}).catch(err=>{
					console.error('获取用户信息异常:',err)
				})
			},
			toSkip(){
				wx.switchTab({
					url: '../my/index'
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	@keyframes mymove {
		0% {
			left: 5rpx;
		}

		8% {
			left: 50rpx;
			top: 10rpx;
		}

		15% {
			left: 100rpx;
			top: 30rpx;
		}

		35% {
			left: 180rpx;
			top: 45rpx;
		}

		50% {
			left: 300rpx;
			top: 60rpx;
		}

		80% {
			left: 500rpx;
			top: 5rpx;
		}

		99% {
			left: 750rpx;
			top: 10rpx;
		}
	}

	.loading {
		display: flex;
		justify-content: center;

		image {
			width: 400rpx;
			height: 300rpx;
			margin-top: 200rpx;
		}
	}

	.fishpond {
		margin-top: 100rpx;

		image {
			position: relative;
			width: 200rpx;
			height: 100rpx;
			transform: rotateY(120deg);
			animation: mymove 30s infinite linear;
		}
	}

	.welcome {
		width: 750rpx;
		height: 800rpx;
	}

	.bottom {
		border-radius: 80rpx;
		font-size: 35rpx;
		color: #fff;
		background: $uni-theme-bg-color;
		position: relative;
		width: 270rpx;
		z-index: 99;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>
