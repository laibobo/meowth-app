<template>
	<view>
		<add-btn class="add-btn"></add-btn>
		<view class="header">
			<view class="userinfo" data-url="./account" @click="navigateTo">
				<image :src="photoUrl" :fade-show="false" mode="aspectFit"></image>
				<text>{{ nickName }}</text>
			</view>
			<!-- 统计 -->
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
		<!-- 账单 -->
		<view class="month-bill" hover-class="hoverstatus" data-url="../eportforms/yearbill" @click="navigateTo">
			<view class="title">
				账单
				<view class="icon iconfont">&#xe6ec;</view>
			</view>
			<view class="info">
				<view class="month-s">
					<text class="month">{{ getMonth }}</text>
					<text class="unit">月</text>
				</view>
				<view>
					<label>收入</label>
					<text>{{ monthBill.income | formatMoney }}</text>
				</view>
				<view>
					<label>支出</label>
					<text>{{ monthBill.expenditure | formatMoney }}</text>
				</view>
				<view>
					<label>结余</label>
					<text>{{ monthBill.surplus | formatMoney }}</text>
				</view>
			</view>
		</view>
		<!-- 总预算 -->
		<view class="budget-col" hover-class="hoverstatus" data-url="../budget/index" @click="navigateTo">
			<view class="title">
				{{ getMonth }}月总预算
				<view v-if="isShow">
					<view v-if="monthBudgetMoney > 0" class="right-btn">
						<text>查看全部</text>
						<view class="icon iconfont">&#xe6ec;</view>
					</view>
					<view v-else>
						<button class="ybtn">+ 设置预算</button>	
					</view>
				</view>
			</view>
			<view class="info">
				<view class="chart">
					<ring-chart :monthExpendMoney="monthExpendMoney" :monthBudgetMoney="monthBudgetMoney" v-if="isLoadingBudget" />
				</view>
				<view class="budgetinfo">					
					<view class="major">
						<label>剩余预算：</label>
						<text>{{getMonthSurplusBudget | formatMoney }}</text>
					</view>
					<view>
						<label>本月预算：</label>
						<text>{{monthBudgetMoney | formatMoney }}</text>
					</view>
					<view>
						<label>本月支出：</label>
						<text>{{getMonthExpendMoney | formatMoney }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="tool">
			<view class="t-item" data-url="../invoice/index" @click="navigateTo">
				<view class="icon-col"><view class="icon iconfont">&#xe71a;</view></view>
				<text>发票助手</text>
			</view>
			<button class="t-item share-btn" plain="true" open-type="share">
				<view class="icon-col"><view class="icon iconfont">&#xe742;</view></view>
				<text>推荐给好友</text>
			</button>
			<image class="cartoon-img" :src="require('@/static/image/an.gif')" />
		</view>
	</view>
</template>

<script>
const app = getApp();
import addBtn from '@/components/add-btn/add-btn.vue';
import Budget from '@/components/budget/budget.vue';
import RingChart from '@/components/ring-chart/ring-chart.vue';
export default {
	components: {
		addBtn,
		Budget,
		RingChart
	},
	data() {
		const date = new Date()
		return {
			photoUrl: '',
			nickName: '',
			sumDay: '--',
			sumLog: '--',
			monthBill: {
				income: '0.00',
				expenditure: '0.00',
				surplus: '0.00'
			},
			monthBudgetMoney: 0,
			monthExpendMoney: 0,
			db: null,
			openid: '',
			isLoadingBudget:true,
			year:date.getFullYear(),
			month:date.getMonth() + 1,
			isShow:false
		};
	},
	onLoad() {
		const _self = this
		app.globalData.wxDB = wx.cloud.database({
			env: 'develop-tm3ye'
		});
		this.db = app.globalData.wxDB
		wx.cloud
		.callFunction({
			name: 'login'
		})
		.then(res => {
			uni.setStorageSync('user.openid', res.result.openid);
			wx.getSetting({
				success: function(res) {
					const isAuthSetting = res.authSetting['scope.userInfo'] !== undefined && res.authSetting['scope.userInfo'] !== false;				
					uni.setStorageSync('isAuthSetting',isAuthSetting)
					if(isAuthSetting){
						wx.getUserInfo({
							success: function(res) {
								uni.setStorageSync('user.info', res.userInfo)
								_self.updateUserInfo()
							}
						});
					}
				},
				fail: function(err) {
					console.error('查询是否授权失败！', err);
				}
			});
		});
	},
	onShow() {
		this.isShow = false
		const userInfo = uni.getStorageSync('user.info') || {};
		this.nickName = userInfo.nickName || '您好！请先登录';
		this.photoUrl = userInfo.avatarUrl || require('@/static/image/photo.png');
		this.monthBudgetMoney = 0
		this.monthExpendMoney = 0
		this.getKeepAccountsInfo();
		this.getNowMonthKeepInfo();
	},
	computed: {
		getMonth() {
			return this.month < 10?`0${this.month}`:this.month;
		},
		getMonthSurplusBudget(){
			return this.monthBudgetMoney<=0?0: this.monthBudgetMoney - this.monthExpendMoney
		},
		getMonthExpendMoney(){
			return this.monthBudgetMoney<=0?0: this.monthExpendMoney
		}
	},
	methods: {
		//分享好友
		onShareAppMessage(){
			return {
				title:'喵喵快速记账~',
				imageUrl: '/static/image/welcome.jpg'
			}
		},
		//跳转页面
		navigateTo(e) {
			if(this.$authorize()){
				let url = e.currentTarget.dataset.url;
				if(url === '../budget/index'){
					url = `${url}?monthBudgetMoney=${this.monthBudgetMoney}&monthExpendMoney=${this.monthExpendMoney}`
				}
				uni.navigateTo({
					url
				});	
			}
		},
		//当月总预算
		getCurrentMonthBudget(expenditure) {
			this.isLoadingBudget = false
			this.db.collection('Budget').where({
				_openid:uni.getStorageSync('user.openid'),
				year:this.year,
				month:this.month,
				type:0
			}).get().then(({data,errMsg})=>{
				if(errMsg.includes('ok') && data.length > 0){
					this.monthBudgetMoney = data[0]['money']
				}
				this.monthExpendMoney = expenditure
				this.isLoadingBudget = true
				this.isShow = true
			})
		},
		//记账统计
		getKeepAccountsInfo() {
			const $ = this.db.command.aggregate;
			const _od = this.db.collection('AccountsRecord').aggregate()
				.match({
					_openid: uni.getStorageSync('user.openid')
				})
			//获取记账总天数
			_od.group({
				_id: '$keepDate'
			})
			.count('sumDay')
			.end()
			.then(res => {
				if (res.list.length > 0) {
					this.sumDay = res.list[0]['sumDay'];
				}
			});
			//获取记账总笔数
			_od.group({
				_id: '$createDate'
			}).count('sumLog')
			.end()
			.then(res => {
				if (res.list.length > 0) {
					this.sumLog = res.list[0]['sumLog'];
				}
			});
		},
		//当前月账单
		getNowMonthKeepInfo() {
			const $ = this.db.command.aggregate
			this.db.collection('AccountsRecord').aggregate().match({
				_openid:uni.getStorageSync('user.openid'),
				keepYear:this.year,
				keepMonth:this.month
			}).group({
				_id: '$categoryType',
				 total: $.sum('$keepMoney')
			}).end().then(({list,errMsg})=>{
				if(errMsg.includes('ok') && list.length > 0){
					let expenditure = 0,income = 0
					for(let i=0;i<list.length;i++){
						if(list[i]['_id'] === 0){
							expenditure = list[i]['total']
						}else{
							income = list[i]['total']
						}
					}
					this.monthBill.expenditure = expenditure
					this.monthBill.income = income
					this.monthBill.surplus = income - expenditure					
					this.getCurrentMonthBudget(expenditure)
				}else{
					this.getCurrentMonthBudget(0)
				}
			})
		},
		//更新用户信息
		updateUserInfo() {
			this.db
				.collection('User')
				.where({
					_openid: uni.getStorageSync('user.openid')
				})
				.get()
				.then(userRes => {
					let userInfo = uni.getStorageSync('user.info') || {};
					if (userRes.data.length > 0) {
						const resData = userRes.data[0],data = {};
						//判断用户是否上传头像、更改昵称，如没有则获取微信数据设置
						data.avatarUrl = userInfo.avatarUrl;
						if (!resData.isCustomNickName) {
							data.nickName = userInfo.nickName;
						}
						data.weChat = userInfo.NickName;
						data.province = userInfo.province;
						data.city = userInfo.city;
						data.gender = userInfo.gender
						this.db
						.collection('User')
						.doc(resData._id)
						.update({
							data
						})
						.then(updateRes => {
							console.log('更新用户信息成功！', updateRes);
							this.getNewUserInfo();
						})
						.catch(err => {
							console.error('更新用户信息成功:', err);
						});
					}
				});
		},
		//获取用户信息（数据库数据）
		getNewUserInfo() {
			this.db
				.collection('User')
				.where({
					_openid: uni.getStorageSync('user.openid')
				})
				.get()
				.then(res => {
					if (res.data.length > 0) {
						uni.setStorageSync('user.info', res.data[0]);
					}
				})
				.catch(err => {
					console.error('获取用户信息异常:', err);
				});
		},
	}
};
</script>
<style lang="scss" scoped>
@mixin panel-style {
	background: #fff;
	margin: 20rpx;
	border-radius: 8rpx;
	overflow: hidden;
}
@mixin title-style {
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.icon {
			color: #b3b3b3;
			text-align: right;
			width: 30rpx;
		}
	}
}
.cartoon-img{
	width: 240rpx;
	height: 100px;
	position: absolute;
	right: 10rpx;
}
.hoverstatus {
	background: #f5f5f5 !important;
}
.add-btn {
	position: fixed;
	right: 40rpx;
	bottom: 80rpx;
	z-index: 10;
}
.budget-col {
	@include panel-style;
	padding: 20rpx 40rpx 50rpx;
	font-size: 32rpx;
	@include title-style;
	height: 165px;
	box-sizing: border-box;
	.info {
		height: 200rpx;
		display: flex;
		justify-content: space-between;
		.chart{
			width: 200rpx;
			margin-top: -20rpx;
			margin-left: -40rpx;
		}
		.budgetinfo{
			color: #656565;
			font-size: 28rpx;
			margin-top: 45rpx;
			width: 350rpx;
			position: relative;
			>view{
				display: flex;
				justify-content: space-between;
				line-height: 50rpx;
				&.major{
					color: #242424;
					font-size: 30rpx;
					border-bottom: 1rpx solid #EDEDED;
					padding-bottom: 5rpx;
					margin-bottom: 5rpx;
				}
			}		
		}
	}
}
.month-bill {
	@include panel-style;
	margin-top: -80rpx;
	padding: 20rpx 40rpx;
	font-size: 32rpx;
	@include title-style;
	.info {
		display: flex;
		color: #3f3f3f;
		margin-top: 30rpx;
		align-items: flex-end;
		label {
			color: #8f8f8f;
			font-size: 26rpx;
		}
		view {
			display: flex;
			flex-direction: column;
			line-height: 50rpx;
			width: 163.3rpx;
			&.month-s {
				display: flex;
				flex-direction: row;
				height: 50rpx;
				width: 105rpx;
				padding-right: 20rpx;
				margin-right: 40rpx;
				margin-bottom: 10rpx;
				box-sizing: border-box;
				border-right: 2rpx solid #9b9b9b;
				.month {
					font-size: 50rpx;
					font-weight: 400;
				}
				.unit {
					font-size: 26rpx;
					margin-top: 10rpx;
				}
			}
		}
	}
}
.tool {
	@include panel-style;
	padding: 40rpx 5rpx;
	display: flex;
	flex-wrap: wrap;
	position: relative;
	.t-item {
		width: 150rpx;
		height: auto;
		text-align: center;
		margin: 0 5rpx;
		.icon-col {
			background: #f8f8f8;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto;
			.iconfont {
				color: #000;
			}
		}
		text {
			font-size: 24rpx;
			color: #333;
			white-space:nowrap;
		}
	}
}
.header {
	background: #ffdb45;
	border-radius: 0 0 40rpx 40rpx;

	.userinfo {
		margin: 0 40rpx;
		padding: 20rpx 0 0;
		box-sizing: border-box;
		color: #333;
		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50rpx;
			vertical-align: middle;
			margin-right: 40rpx;
		}
	}
	.statistic {
		display: flex;
		padding: 20rpx 0 100rpx;
		> view {
			flex: 1;
			text-align: center;
			> text {
				display: block;
				font-size: 24rpx;
				&:first-child {
					color: #333235;
					font-size: 36rpx;
					font-weight: 600;
				}
				&:last-child {
					color: #565656;
				}
			}
		}
	}
}
.share-btn{
	line-height: 35rpx;
	border: none;
	padding: 0;
}
</style>
