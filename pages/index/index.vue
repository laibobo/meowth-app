<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="loading" v-if="loading">
			<image src="../../static/image/loading.gif"></image>
		</view>
		<view v-if="!isAuthSetting">
			<image src="../../static/image/welcome.png" class="welcome"></image>			
			<button class="bottom" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="getUserInfo">开启记账之旅</button>
			<view class="fishpond">
				<image :src="fishImgSrc" class="y1"></image>
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
				fishImgSrc:require('@/static/image/01.jpg')
			}
		},
		onLoad() {
			app.globalData.wxDB = wx.cloud.database({
				env: 'develop-tm3ye'
			})
			wx.cloud.callFunction({
				name: 'login'
			}).then(res => {
				app.globalData.openid = res.result.openid
			})
			const that = this;
			wx.getSetting({
				success: function(res) {
					setTimeout(_ => {
						that.loading = false
						that.isAuthSetting = res.authSetting['scope.userInfo'] !== undefined
						if (that.isAuthSetting) {
							wx.switchTab({
								url: '../my/index'
							})
						}
					}, 3000)
				},
				fail: function(err) {
					console.error('查询是否授权失败！', err)
				}
			})
		},
		methods: {
			getUserInfo() {
				const that = this;
				wx.getUserInfo({
					success: function(res) {
						getApp().globalData.userInfo = res.userInfo
						that.updateUserInfo()
						wx.switchTab({
							url: '../my/index'
						})
					}
				})
			},
			updateUserInfo() {
				const db = wx.cloud.database({
					env: 'develop-tm3ye'
				})
				wx.cloud.callFunction({
					name: 'login'
				}).then(res => {
					db.collection('User').where({
						_openid: res.openid
					}).get().then(userRes => {
						const userInfo = getApp().globalData.userInfo
						console.log('app', getApp().globalData)
						if (userRes.data.length === 0) {
							const nowdate = new Date()
							db.collection('User').add({
								data: {
									nickName: userInfo.NickName,
									gender: userInfo.gender,
									avatarUrl: userInfo.avatarUrl,
									weChat: '',
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
						} else {
							console.log('update', userRes)
							const data = {}
							if (!userRes.data.isCustomPhoto) {
								data.avatarUrl = userInfo.avatarUrl
							}
							if (!userRes.data.isCustomNickName) {
								data.nickName = userInfo.NickName
							}

							// db.collection('User').doc(userRes.data._id).update({
							// 	data
							// }).then(updateRes=>{
							// 	console.log('更新用户信息成功！',updateRes)
							// }).catch(err=>{
							// 	console.error(err)
							// })
						}
					})
				}).catch(err => {
					console.error(err)
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	@keyframes mymove {
		0%{
			left: 5rpx;
		}
		8%{
			left: 50rpx;
			top: 10rpx;
		}
		15%{
			left: 100rpx;
			top: 30rpx;
		}
		35%{
			left: 180rpx;
			top: 45rpx;
		}
		50%{
			left: 300rpx;
			top: 60rpx;
		}
		80%{
			left: 500rpx;
			top: 5rpx;
		}
		99%{
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
