<template>
	<view>
		<circle-button class="add-btn" />
		<view class="header">
			<view class="userinfo" data-url="./account" @click="navigateTo">
				<image :src="getPhotoUrl || require('@/static/image/photo.png')" :fade-show="false" mode="aspectFill"></image>
				<text>{{ getNickName }}</text>
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
				<view>
					<view v-if="getIsMonthBudget" class="right-btn">
						<text>查看全部</text>
						<view class="icon iconfont">&#xe6ec;</view>
					</view>
					<view v-else>
						<button class="ybtn">+ 设置预算</button>
					</view>
				</view>
			</view>
			<view class="info">
				<budget chartElementId="my_chart" />
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
			<view class="t-item" data-url="../rests/reward" @click="navigateTo">
				<view class="icon-col"><view class="icon iconfont">&#xe6e6;</view></view>
				<text>打赏作者</text>
			</view>
			<view class="t-item" data-url="../rests/feedback" @click="navigateTo">
				<view class="icon-col"><view class="icon iconfont">&#xe6e9;</view></view>
				<text>建议或反馈</text>
			</view>
			<view class="t-item" data-url="../rests/index" @click="navigateTo">
				<view class="icon-col"><view class="icon iconfont">&#xe6ea;</view></view>
				<text>关于喵喵</text>
			</view>
			<image class="cartoon-img" :src="require('@/static/image/an.gif')" />
		</view>
	</view>
</template>

<script>
const app = getApp();
import circleButton from '@/components/circle-button/circle-button.vue';
import Budget from '@/components/budget/budget.vue';
import RingChart from '@/components/ring-chart/ring-chart.vue';
const categorysData = require('@/public/data.json')
import { 
	login,
	getKeepRecord,
	getBudget,
	getCurrentUser,
	registerUser,
	addCategorys
} from '@/public/api.js'

export default {
	components: {
		circleButton,
		Budget,
		RingChart
	},
	data() {
		const date = new Date()
		return {
			sumDay: '--',
			sumLog: '--',
			monthBill: {
				income: '0.00',
				expenditure: '0.00',
				surplus: '0.00'
			},
			year:date.getFullYear(),
			month:date.getMonth() + 1			
		};
	},
	onLoad() {
		login().then(({isAuthSetting})=>{
			if(isAuthSetting){
				this.saveUserInfo()
			}
		})
	},
	onShow() {
		this.getNowMonthKeepInfo();
		this.getKeepAccountsInfo();
	},
	computed: {
		getMonth() {
			return this.month < 10?`0${this.month}`:this.month;
		},
		getNickName(){
			return this.$store.getters.loginUserInfo.nickName || '点击登录'
		},
		getPhotoUrl(){
			return this.$store.getters.loginUserPhoto;
		}
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
			if(this.$authorize()){
				uni.navigateTo({
					url:e.currentTarget.dataset.url
				})
			}
		},
		//当月总预算
		getCurrentMonthBudget(expenditure) {
			getBudget({
				_openid: uni.getStorageSync(this.$conf.storageKey.openid),
				year:this.year,
				month:this.month,
				type:0
			}).then(({data,errMsg})=>{
				if(errMsg.includes('ok') && data.length > 0){
					this.$store.commit('SET_MONTHBUDGEMONEY',data[0]['money'])
				}
				this.$store.commit('SET_MONTHEXPENDMONEY',expenditure)
				this.loadingBudgetMonthChart()
			})
		},
		//记账统计
		getKeepAccountsInfo() {
			getKeepRecord({
				_openid: uni.getStorageSync(this.$conf.storageKey.openid)
			}).then(({errMsg,data})=>{
				if(data.length > 0){
					this.sumDay = data.length
					this.sumLog = data.map((rdata)=>rdata.logs.length).reduce((a,b)=>a+b)
				}else{
					this.sumDay = '--'
					this.sumLog = '--'
				}
			})
		},
		//当前月账单
		getNowMonthKeepInfo() {
			getKeepRecord({
				_openid:uni.getStorageSync(this.$conf.storageKey.openid),
				year:Number(this.year),
				month:Number(this.month)
			}).then(({data,errMsg})=>{
				if(errMsg.includes('ok') && data.length > 0){
					const { expendSum,incomeSum } = data[0]
					this.monthBill.expenditure = expendSum
					this.monthBill.income = incomeSum
					this.monthBill.surplus = incomeSum - expendSum
					this.getCurrentMonthBudget(expendSum)
				}else{
					this.monthBill.expenditure = 0
					this.monthBill.income = 0
					this.monthBill.surplus = 0
					this.getCurrentMonthBudget(0)	
				}
				
			})
		},
		saveUserInfo() {
			return new Promise((resolve,reject)=>{
				getCurrentUser().then(({data}) => {
						if (data.length > 0) {
							this.$store.commit('SET_USERINFO',data[0])
						}else{
							const _self = this
							wx.getUserInfo({
								success: function(res) {
									_self.$store.commit('SET_USERINFO',res.userInfo)
									_self.addUserInfo(res.userInfo)
									_self.addDefaultCategorys()
								}
							});
						}
						resolve()
					})
					.catch(err => {
						this.showNetworkIsError()
						reject(err)
					});
			})
		},
		addUserInfo(userInfo) {
			const nowdate = new Date()
				registerUser({
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
			addCategorys({
				expends:defaultCategorys.expends,
				incomes:defaultCategorys.incomes
			})
		}
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
	bottom: 0;
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
	height: 185px;
	box-sizing: border-box;
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
