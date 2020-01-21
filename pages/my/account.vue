<template>
	<view class="">
		<!-- 个人信息 -->
		<view class="info-list">
			<view @click="handleEditPhoto">
				<label>头像</label>
				<view class="header v_s"><image :src="photoUrl"></image></view>
				<view class="icon iconfont" v-html="rightIcon"></view>
			</view>
			<view @click="handleNiceNameInputFocus">
				<label>昵称</label>
				<input type="text" class="nickname-input" placeholder="请输入昵称" :value="nickName" maxlength="20" @blur="hanleUpdateNickName" />
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
			<!-- <view @click="handleEditPhone">
				<label>手机号</label>
				<view class="v_s"></view>
				<view class="icon iconfont" v-html="rightIcon"></view>
			</view> -->
		</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			rightIcon: '&#xe6ec;',
			sexArr: ['男', '女'],
			sex: 0,
			photoUrl: '',
			nickName: '',
			userTableId: '',
			isNiceNameInputFocus: false
		};
	},
	onLoad() {
		this.db = app.globalData.wxDB;
		const userInfo = uni.getStorageSync('user.info');
		this.photoUrl = userInfo.avatarUrl;
		this.nickName = userInfo.nickName;
		this.userInfo = userInfo;
		const _self = this;
		if (userInfo.isCustomPhoto) {
			wx.cloud.downloadFile({
				fileID: userInfo.avatarUrl,
				success: res => {
					_self.photoUrl = res.tempFilePath;
				},
				fail: console.error
			});
		}
		this.db
			.collection('User')
			.where({
				_openid: uni.getStorageSync('user.openid')
			})
			.get()
			.then(res => {
				const data = res.data[0];
				this.userTableId = data._id;
				this.sex = data.gender;
			})
			.catch(err => {
				console.error('获取用户信息异常:', err);
			});
	},
	methods: {
		handleNiceNameInputFocus() {
			this.isNiceNameInputFocus = true;
		},
		hanleUpdateNickName(e) {
			const nickName = e.detail.value.trim();
			if (nickName) {
				this.updateUserInfo({
					nickName,
					isCustomNickName: true
				});
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
							console.log('res.fileID:', res.fileID);
							_self.updateUserInfo({
								avatarUrl: res.fileID,
								isCustomPhoto: true
							});
						},
						fail: console.error
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
			this.db
				.collection('User')
				.doc(this.userTableId)
				.update({
					data
				})
				.then(res => {
					this.userInfo = Object.assign({}, this.userInfo, data);
					uni.setStorageSync('user.info', this.userInfo);
					console.log('更新用户信息成功');
				})
				.catch(err => {
					console.error('更新用户信息失败：', err);
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.info-list {
	> view {
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
</style>
