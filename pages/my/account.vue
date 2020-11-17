<template>
	<view>
		<!-- 个人信息 -->
		<view class="info-list">
			<view @click="handleEditPhoto">
				<label>头像</label>
				<view class="header v_s">
					<image :src="photoUrl" :fade-show="false" mode="aspectFit"></image>
				</view>
				<view class="icon iconfont" v-html="rightIcon"></view>
			</view>
			<view @click="openUpdateNiceName">
				<label>昵称</label>
				<view class="v_s">{{nickName}}</view>
				<view class="icon iconfont" v-html="rightIcon"></view>
			</view>
			<view>
				<label>性别</label>
				<view class="v_s sex-picker">
					<picker :value="sex" :range="sexArr" @change="handleSex">
						<view>{{ sexArr[sex] }}</view>
					</picker>
				</view>
				<view class="icon iconfont" v-html="rightIcon"></view>
			</view>
		</view>
		<bobo-dialog v-if="visible" class="nicename-dialog" :visible.sync="visible" title="昵称" @affirm="handleNiceName">
			<input type="text" v-model="editNiceName" maxlength="20" placeholder="请输入昵称" />
		</bobo-dialog>
	</view>
</template>

<script>
	const app = getApp();
	import BoboDialog from '@/components/dialog/dialog.vue'
	export default {
		components: {
			BoboDialog
		},
		data() {
			return {
				rightIcon: '&#xe6ec;',
				sexArr: ['男', '女'],
				sex: 0,
				photoUrl: '',
				nickName: '',
				userId: '',
				visible: false,
				editNiceName:''
			};
		},
		onLoad() {
			this.db = app.globalData.wxDB;
			const userInfo = this.$store.getters.loginUserInfo;
			this.photoUrl = this.$store.getters.loginUserPhoto
			this.nickName = userInfo.nickName;
			this.userInfo = userInfo;
			
			this.db
				.collection(this.$conf.database.User)
				.where({
					_openid: this.getOpenid
				})
				.get()
				.then(res => {
					if(res.data){
						const data = res.data[0];
						this.userId = data._id;
						this.sex = data.gender;
					}
				})
				.catch(err => {
					this.showNetworkIsError()
					console.error(err)
				});
		},
		methods: {
			openUpdateNiceName() {
				this.visible = true;
				this.editNiceName = this.nickName
			},
			handleNiceName(e) {
				const nickName = this.editNiceName
				if (nickName) {
					this.updateUserInfo({
						nickName
					}).then(res=>{
						this.nickName = nickName
						this.visible = false
					})
				}else{
					uni.showToast({
						title: '请输入昵称',
						icon: 'none'
					})
				}
			},
			handleEditPhoto() {
				const _self = this;
				uni.chooseImage({
					count: 1,
					success(res) {
						_self.photoUrl = res.tempFilePaths[0];
						wx.cloud.uploadFile({
							cloudPath: `user/${Date.parse(new Date())}.png`,
							filePath: res.tempFilePaths[0],
							success: res => {
								_self.updateUserInfo({
									imageFileId: res.fileID
								})
							},
							fail: err=>{
								_self.showNetworkIsError()
								console.error(err)
							}
						});
					}
				});
			},
			handleSex(data) {
				this.sex = Number(data.detail.value);
				this.updateUserInfo({
					gender: this.sex
				});
			},
			updateUserInfo(data) {
				return new Promise((resolve,reject)=>{
					this.db
						.collection(this.$conf.database.User)
						.doc(this.userId)
						.update({
							data
						})
						.then(res => {
							this.userInfo = Object.assign({}, this.userInfo, data);
							this.$store.commit('SET_USERINFO',this.userInfo)
							resolve('更新成功')
						})
						.catch(err => {
							this.showNetworkIsError()
							reject('更新失败')
							console.error(err)
						});
					})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.info-list {
		>view {
			position: relative;
			width: 750rpx;
			height: 110rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;
			color: #333;
			padding: 0 30rpx;

			label {
				color: #000;
			}

			.v_s {
				margin-right: 40rpx;
			}

			.sex-picker {
				width: 500rpx;

				view {
					text-align: right;
				}
			}

			.iconfont {
				color: #333;
				margin-right: -10rpx;
				position: absolute;
				right: 30rpx;
			}

			&:before {
				content: '';
				position: absolute;
				left: 25rpx;
				bottom: -1rpx;
				width: 1400rpx;
				border-bottom: 1px solid #dcdcdc;
				transform-origin: 0 0;
				transform: scale(0.5, 0.5);
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;
			}

			.header {
				image {
					width: 70rpx;
					height: 70rpx;
					border-radius: 35rpx;
				}
			}
		}

		.nickname-input {
			text-align: right;
			padding-right: 30rpx;
		}
	}

	.nicename-dialog {
		input {
			border-bottom: 2rpx solid #C0C0C0;
			font-size: 28rpx;
			padding: 6rpx 0;
			color: #565656;

			&:focus {
				border-bottom-color: #ccc;
			}
		}
	}
</style>
