<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view>
			<view class="header"><image src="../../static/image/wxlogin.png"></image></view>
			<view class="content">
				<text>记录生活美好~</text>
			</view>
			<button class="bottom" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="getUserInfo">开启记账之旅</button>
		</view>
		<!-- #endif-->
	</view>
</template>

<script>
const app = getApp()
export default {
	data() {
		return {
		}
	},
	onLoad() {
		app.globalData.wxDB =  wx.cloud.database({
			env: 'develop-tm3ye'
		}) 
		wx.cloud.callFunction({
			name:'login'
		}).then(res=>{
			app.globalData.openid = res.result.openid
		})
		console.log(wx.env)
		let _this = this;
		wx.getSetting({
			success:function(res){
				if(res.authSetting['scope.userInfo']){
					_this.getUserInfo()
				}else{
					wx.authorize({
						scope: 'scope.userInfo',
						success (res) {
							console.log('授权成功:',res);
							_this.getUserInfo()
						}
				  })
				}
			},
			fail:function(err){
				console.error('查询是否授权失败！',err)
			}
		})
	},
	methods: {
		getUserInfo() {
			let _this = this;			
			wx.getUserInfo({
				success: function(res) {					
					getApp().globalData.userInfo = res.userInfo;
					_this.updateUserInfo()
					wx.switchTab({
						url:'../my/index'
					})
				}
			})
		},
		updateUserInfo(){
			const db = wx.cloud.database({
			  env: 'develop-tm3ye'
			})
			wx.cloud.callFunction({
				name:'login'
			}).then(res=>{
				db.collection('User').where({
					_openid: res.openid
				}).get().then(userRes=>{			
					const userInfo = getApp().globalData.userInfo
					console.log('app',getApp().globalData)
					if(userRes.data.length === 0){
						var date = new Date()
						db.collection('User').add({
							data:{
								nickName:userInfo.NickName,
								gender:userInfo.gender,
								avatarUrl:userInfo.avatarUrl,
								weChat:'',
								province:userInfo.province,
								city:userInfo.city,
								theme:'mint-green',
								registerTime:date.getTime(),
								registerYear:date.getFullYear(),
								isCustomPhoto:false,
								isCustomNickName:false
							}
						}).then(addRes=>{
							console.log('添加用户信息成功！',addRes)
						}).catch(err=>{
							console.error(err)
						})
					}else{
						console.log('update')
						const data = {}
						if(!userRes.data.isCustomPhoto){
							data.avatarUrl = userInfo.avatarUrl
						}
						if(!userRes.data.isCustomNickName){
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
			}).catch(err=>{
				console.error(err)
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.header {
	margin: 90rpx 0 90rpx 50rpx;
	text-align: center;
	width: 650rpx;
	height: 300rpx;
	line-height: 450rpx;
}

.header image {
	width: 200rpx;
	height: 200rpx;
}

.content {
	margin-left: 50rpx;
	margin-bottom: 90rpx;
	text-align: center;
	color: #666;
}

.content text {
	display: block;
	color: #9d9d9d;
	margin-top: 40rpx;
}

.bottom {
	border-radius: 80rpx;
	margin: 70rpx 100rpx;
	font-size: 35rpx;
	color: #fff;
	background: $uni-theme-bg-color;
}
</style>
