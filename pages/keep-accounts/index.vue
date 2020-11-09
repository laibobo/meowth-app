<template>
	<view class="page">
		<tabs class="tabs-col" :values="tabValues" :current="currentCategoryType" @clickItem="handleTabsItem"></tabs>
		<!-- 类别列表 -->
		<scroll-view class="category-scroll" :scroll-top="scrollTop" scroll-y="true" :style="getScrollHeight">
			<!-- 支出 -->
			<view class="expend-category-col" v-show="currentCategoryType === 0">
				<loading v-if="expendCategoryLoading" />
				<view v-else class="tabs-container">
					<view v-for="(item, index) in expendCategoryList" :key="index" :class="['category', { 'category-active': item._id === activeCategoryId }]" :data-id="item._id" :data-name="item.name"  @click="handleKeep">
						<view class="icon-col"><view class="icon iconfont" v-html="item.icon"></view></view>
						<text class="explain">{{ item.name }}</text>
					</view>				
					<view class="category" @click="handleDeploy">
						<view class="icon-col"><view class="icon iconfont">&#xe6df;</view></view>
						<text class="explain">设置</text>
					</view>
				</view>
			</view>
			<!-- 收入 -->
			<view class="income-category-col" v-show="currentCategoryType !== 0">
				<loading v-if="incomeCategoryLoading" />
				<view v-else class="tabs-container">
					<view v-for="(item, index) in incomeCategoryList" :key="index" :class="['category', { 'category-active': item._id === activeCategoryId }]" :data-id="item._id" :data-name="item.name"  @click="handleKeep">
						<view class="icon-col"><view class="icon iconfont" v-html="item.icon"></view></view>
						<text class="explain">{{ item.name }}</text>
					</view>				
					<view class="category" @click="handleDeploy">
						<view class="icon-col"><view class="icon iconfont">&#xe6df;</view></view>
						<text class="explain">设置</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 记账面板 -->
		<view class="keep-panel" v-show="isOpenKeyboard">
			<view class="form">
				<view class="money-col">
					<text class="mark">￥</text>
					<text class="moneyshow">{{ money }}</text>
					<text class="m-focus"></text>
				</view>
				<view class="r-p">
					<text class="s-r">{{ remark }}</text>
					<text class="remark" @click="handleOpenRemarkPanel">{{ optRemarkBtnText }}</text>
				</view>
				<!-- <view class="r-p">
					<image :src="keepImage" :fade-show="false" mode="aspectFit"></image>
					<text class="remark" @click="handleKeepImage">添加图片</text>
					<text>查看</text>
				</view> -->
			</view>
			<view class="m-keyboard">
				<view class="m-keyboard-code">
					<view v-for="(item,index) in keyboardCodeArr" @click="handleKeyCode" hover-class="paw" :data-code="item" :key="index">{{item}}</view>
					<view @click="handleDeleteKeyCode" hover-class="keyboarhover"><view class="icon iconfont" style="color: red;">&#xe6eb;</view></view>
				</view>
				<view class="m-keyboard-tool">
					<view class="s-zo" hover-class="paw1">
						<picker class="keepdate-picker" mode="date" :value="keepDate" @change="handleKeepDateChange" :disabled="keepAccountId !== ''">
							<view class="uni-input" style="font-weight: 600;">{{ getShowKeepDate }}</view>
						</picker>
					</view>
					<view v-for="(item,index) in ufuncArr" @click="handleUfuncCode(item)" :key="index" hover-class="paw1">{{item}}</view>				
					<view class="submit-btn s-zo" v-if="!isMoneySum" @click="handleKeyboardSubmit">完成</view>
					<view class="submit-btn s-zo" v-else @click="handleMoneySum">=</view>
				</view>
			</view>
		</view>
		<!-- 备注面板 -->
		<remark-panel class="remarkp" :visible.sync="isOpenRemarkPanel" :content="remark" @confirm="handleConfirmRemark" @close="handleCancelRemark" />
	</view>
</template>

<script>
const app = getApp();
import RemarkPanel from './remark-panel.vue';
import { getElement } from '@/public/index.js';
import Tabs from '@/components/tabs/tabs.vue';
export default {
	components: {
		RemarkPanel,
		Tabs
	},
	data() {
		return {
			ufuncArr: ['÷', 'x', '+', '-'],
			keyboardCodeArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0],
			tabValues: ['支出', '收入'],
			windowHeight: 0,
			scrollHeight: 0,
			keepDate: '',
			money: '',
			remark: '',
			currentCategoryType: 0,
			typeArr:['expenditureList','incomeList'],
			expendCategoryList:[],
			incomeCategoryList:[],
			expendCategoryLoading:false,
			incomeCategoryLoading:false,
			activeCategoryId: '',
			activeCategoryName: '',
			isMoneySum: false,
			isOpenKeyboard: false,
			isOpenRemarkPanel: false,
			checkedUfunc: '',
			ufuncArr: ['÷', 'x', '+', '-'],
			scrollTop:0,
			keepAccountId:'',
			keepImage:'',
			keepImageFileId:''
		};
	},
	onLoad(option) {
		this.setKeepDate();
		this.DB = app.globalData.wxDB;
		if(Object.keys(option).length > 0){
			this.keepAccountId = option.keepAccountId
		}
	},
	onShow() {
		const that = this;
		uni.getSystemInfo({
			success: function(res) {
				const windowHeight = res.windowHeight;
				that.scrollHeight = windowHeight;
				that.windowHeight = windowHeight;
			}
		});
		if(this.keepAccountId){
			this.DB.collection(this.$conf.database.AccountsRecord).doc(this.keepAccountId).get().then(({data})=>{
				this.currentCategoryType = data.categoryType
				if(data.categoryType === 0){
					this.getExpendCategoryList()
				}else{
					this.getIncomeCategoryList()
				}
				this.keepDate = data.keepDate
				this.money = data.keepMoney
				this.remark = data.remark
				this.activeCategoryId = data.categoryId
				this.activeCategoryName = '';
				this.isOpenRemarkPanel = false;
				this.isOpenKeyboard = true;
			}).catch(err=>{
				this.showNetworkIsError()
				console.error(err)
			})
		}else{
			this.getExpendCategoryList();
		}	
	},
	computed: {
		getShowKeepDate(){
			if(this.keepDate){
				const keepDate = new Date(this.keepDate),date = new Date(),y = keepDate.getFullYear(),m = keepDate.getMonth() + 1,d = keepDate.getDate()						
				return y == date.getFullYear() && m == (date.getMonth() + 1) && d == date.getDate() ? '今天':`${y}/${m}/${d}`
			}
			return ''
		},
		getScrollHeight() {
			return `height:${this.scrollHeight}px;`;
		},
		optRemarkBtnText() {
			return this.remark === '' ? '添加备注' : '修改';
		}
	},
	methods: {
		handleKeepImage() {
			const _self = this;
			uni.chooseImage({
				count: 1,
				success(res) {
					_self.keepImage = res.tempFilePaths[0];
					wx.cloud.uploadFile({
						cloudPath: `user/${Date.parse(new Date())}.png`,
						filePath: res.tempFilePaths[0],
						success: res => {
							_self.keepImageFileId = res.fileID
						},
						fail: err=>{
							_self.showNetworkIsError()
							console.error(err)
						}
					});
				}
			});
		},
		//获取支出类目数据
		getExpendCategoryList() {
			const expendList = this.$store.getters.categoryExpendList
			if(expendList.length > 0){
				this.expendCategoryList = expendList;
				return
			}
			
			this.expendCategoryLoading= true
			this.getCategoryList().then(({ result }) => {
				this.expendCategoryList = result.data;
				this.$store.commit('SET_CATEGORYEXPENDLIST',result.data)
				this.calculateScrollHeight();
				setTimeout(_=>{
					this.expendCategoryLoading = false
				},1000)
			})
			.catch(err=>{
				this.showNetworkIsError()
				console.error(err)
			});
		},
		//获取收入类目数据
		getIncomeCategoryList() {
			const incomeList = this.$store.getters.categoryIncomeList
			if(incomeList.length > 0){
				this.incomeCategoryList = incomeList
				return
			}
			
			this.incomeCategoryLoading = true
			this.getCategoryList().then(({ result }) => {
				this.incomeCategoryList = result.data;
				this.$store.commit('SET_CATEGORYINCOMELIST',result.data)
				this.calculateScrollHeight();
				setTimeout(_=>{
					this.incomeCategoryLoading = false
				},1000)
			})
			.catch(err=>{
				this.showNetworkIsError()
				console.error(err)
			});
		},
		//获取类目数据
		getCategoryList() {
			const type = this.currentCategoryType;
		 	return wx.cloud.callFunction({
				name: 'getCategoryList',
				data: {
					type,
					_openid:this.getOpenid
				}
			})
		},
		//点击tabs项
		handleTabsItem(index) {
			if (this.currentCategoryType !== index) {
				this.currentCategoryType = index;
				if(index === 0 && this.expendCategoryList.length === 0){
					this.getExpendCategoryList()
				}else if(index === 1 && this.incomeCategoryList.length === 0){
					this.getIncomeCategoryList()
				}
			}
			this.calculateScrollHeight()
		},
		//设置类目  跳转类目管理页面
		handleDeploy() {
			const categoryType = this.currentCategoryType;
			uni.navigateTo({
				url: '../category-config/index?categoryType=' + categoryType
			});
		},
		//点击类目
		handleKeep(e) {
			const data = e.currentTarget
			this.activeCategoryId = data.dataset.id;
			this.activeCategoryName = data.dataset.name;
			this.isOpenKeyboard = true;
			this.isOpenRemarkPanel = false;
			this.calculateScrollHeight();
		},
		//计算列表容器高度
		calculateScrollHeight() {
			let panelClass,
				isOpt = false;
			if (this.isOpenKeyboard) {
				panelClass = '.keep-panel';
			}
			if (this.isOpenRemarkPanel) {
				panelClass = '.remarkp';
			}
			if (panelClass != undefined) {
				setTimeout(_ => {
					uni.createSelectorQuery()
						.select(panelClass)
						.boundingClientRect(e => {
							this.scrollHeight = parseFloat(this.windowHeight) - parseFloat(e.height);							
							this.setScrollListTop()
						})
						.exec();
				});
			}
		},
		setScrollListTop(){
			uni.createSelectorQuery()
				.select('.category-active')
				.boundingClientRect(e=>{
					if(e){
						this.scrollTop = e.top - 60	
					}					
				}).exec();
		},
		handleOpenRemarkPanel() {
			this.isOpenRemarkPanel = true;
			this.isOpenKeyboard = false;
			this.calculateScrollHeight();
		},
		handleCancelRemark() {
			this.isOpenKeyboard = true;
			this.calculateScrollHeight();
			if (this.optRemarkBtnText === '修改') {
				return;
			}
			this.remark = '';
		},
		handleConfirmRemark(value) {
			this.isOpenKeyboard = true;
			this.calculateScrollHeight();
			this.remark = value;
		},
		handleDeleteKeyCode() {
			const moneyStr = this.money.toString();
			if (moneyStr === '') {
				return;
			}
			const deleteCharIndex = moneyStr.length - 1;
			this.money = moneyStr.substring(0, deleteCharIndex);
		},
		handleKeyCode(e) {
			const code = e.currentTarget.dataset.code;
			const ufuncArr = this.ufuncArr;
			const moneyRule = /^[0-9]+(\.?)([0-9]{1,2})?$/;
			const isNumberRule = /[0-9]\d*/;
			const moneyStr = this.money.toString();
			const moneyStrLength = moneyStr.length - 1;

			if (moneyStr !== '' && !isNumberRule.test(code) && moneyStr.indexOf('.') === moneyStrLength) {
				return;
			}
			const tepMoney = moneyStr + code;
			this.isMoneySum = /\d+([+x÷-]\d+)+/.test(tepMoney);

			const lastChar = moneyStr.substring(moneyStrLength);

			if (/[+x÷-]/.test(lastChar)) {
				if (code === '.') {
					return;
				}
			} else {
				const isStartZero = moneyStr.length === 1 && moneyStr.indexOf('0') > -1;
				if ((isStartZero && code === '0') || (isStartZero && isNumberRule.test(code))) {
					return;
				}

				let isNoPass = true;
				let isIncludeUfunc = false;
				for (let i = 0; i < ufuncArr.length; i++) {
					const ufunc = ufuncArr[i];
					if (tepMoney.indexOf(ufunc) > -1) {
						isIncludeUfunc = true;
						this.checkedUfunc = ufunc;
						const splitArr = tepMoney.split(ufunc);
						if (!moneyRule.test(splitArr[1])) {
							isNoPass = false;
						}
						break;
					}
				}
				if (!isNoPass || (!isIncludeUfunc && !moneyRule.test(tepMoney))) {
					return;
				}
			}
			this.money = tepMoney;
		},
		handleUfuncCode(code) {
			const moneyStr = this.money.toString();
			const lastChar = moneyStr.substring(moneyStr.length - 1);
			if (/[+x÷-]/.test(lastChar) || lastChar === '.') {
				return;
			}
			const ufuncArr = this.ufuncArr;
			let isMoneyCount = false;
			for (let i = 0; i < ufuncArr.length; i++) {
				const ufunc = ufuncArr[i];
				if (lastChar !== ufunc && moneyStr.indexOf(ufunc) > -1 && ufuncArr.indexOf(code) > -1) {
					isMoneyCount = true;
					this._sumMoney(moneyStr, ufunc, code);
					break;
				}
			}
			if (isMoneyCount) {
				return;
			}
			this.money = moneyStr + code;
		},
		//=按钮操作 金额合计
		handleMoneySum() {
			const ufuncArr = this.ufuncArr;
			const moneyStr = this.money.toString();
			for (let i = 0; i < ufuncArr.length; i++) {
				const ufunc = ufuncArr[i];
				if (moneyStr.indexOf(ufunc) > -1) {
					this._sumMoney(moneyStr, ufunc);
					break;
				}
			}
			this.isMoneySum = false;
		},
		//自定义键盘-完成操作
		handleKeyboardSubmit() {
			const money = this.money.toString().replace(/[\.+x÷-]$/, '');
			if (money === '' || Number(money) === 0) {
				return;
			}
			const keepDate = new Date(`${this.keepDate} 00:00:00`)
				,keepWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][new Date(keepDate).getDay()]
				,categoryId = this.activeCategoryId
				,categoryType = this.currentCategoryType
				,remark = this.activeCategoryName + this.remark
				,keepMoney = parseFloat(money)
				,keepYear = keepDate.getFullYear()
				,keepMonth = keepDate.getMonth() + 1
				,keepDay = keepDate.getDate()
				,createDate = new Date()
				
			if(this.keepAccountId){
				this.DB.collection('AccountsRecord')
				.doc(this.keepAccountId)
				.update({
					data:{
						keepMoney,
						remark,
						categoryId,
						categoryType
					}
				}).then(res=>{
					if (res.errMsg == 'document.update:ok') {
						uni.switchTab({
							url:'./detail'
						})
					}
				}).catch(err=>{
					uni.showModal({
						title:'程序异常',
						content:err
					})
				})
			}else{
				this.DB
					.collection('AccountsRecord')
					.add({
						data: {
							keepMoney,
							remark,
							categoryId,
							categoryType,
							keepWeek,
							keepDate,
							keepYear,
							keepMonth,
							keepDay,
							createDate
						}
					})
					.then(res => {
						if (res.errMsg.includes('ok')) {
							uni.switchTab({
								url:'./detail'
							})
						}
					})
					.catch(err=>{
						uni.showModal({
							title:'程序异常',
							content:err
						})
					});
			}
		},
		//选择账单日期
		handleKeepDateChange(e) {
			this.keepDate = e.detail.value;
		},
		setKeepDate() {
			const nowDate = new Date();
			const year = nowDate.getFullYear();
			let month = nowDate.getMonth() + 1;
			let day = nowDate.getDate();
			if (month < 10) {
				month = '0' + month;
			}
			if (day < 10) {
				day = '0' + day;
			}
			this.keepDate = `${year}-${month}-${day}`;
		},
		_sumMoney(moneyStr, ufunc, code = '') {
			const splitArr = moneyStr.split(ufunc);
			let moneyCount = 0;
			const number1 = Number(splitArr[0]);
			const number2 = Number(splitArr[1]);
			switch (ufunc) {
				case '+':
					moneyCount = number1 + number2;
					break;
				case '-':
					moneyCount = number1 - number2;
					break;
				case 'x':
					moneyCount = number1 * number2;
					break;
				case '÷':
					moneyCount = number1 / number2;
					break;
			}
			this.money = `${Math.floor(moneyCount * 100) / 100}${code}`;
		}
	}
};
</script>

<style lang="scss" scoped>
@-webkit-keyframes blink {
	0% {
		opacity: 1;
	}

	50% {
		opacity: 1;
	}

	50.01% {
		opacity: 0;
	}

	100% {
		opacity: 0;
	}
}
.remarkp{
	position: absolute;
	left: 0;
	bottom: 0;
}
.m-focus {
	height: 100rpx;
	border: 1rpx solid #eee;
	margin-left: 15rpx;
	position: relative;
	top: 30rpx;
	content: '';
	border: 1px solid #dcdcdc;
	transform-origin: 0 0;
	transform: scale(0.5, 0.5);
	box-sizing: border-box;
	animation: blink 1s linear infinite;
}
.loading{
	position: fixed;
	top: 150rpx;
	left: 340rpx;
}

.keep-panel {
	width: 750rpx;
	height: auto;
	background: #fff;
	box-sizing: border-box;
	position: fixed;
	left: 0;
	bottom: 0;
	border-radius: 30rpx;
	border-top: 2rpx solid #eee;
	box-shadow: 10rpx 3rpx 5rpx #eee;
	.keyboarhover{
		background: #f5f5f5 !important;
	}
	.paw{
		background: url(../../static/image/paw.png) no-repeat center center !important;
	}
	.paw1{
		background: url(../../static/image/paw1.png) no-repeat center center !important;
	}
	.moneyshow{
		max-width:600rpx;
		word-wrap: break-word;
		word-break: normal;
	}
	.money-col {
		display: flex;
		font-size: 50rpx;
		color: #000;
		border-bottom: 2rpx solid #dbdbdb;
		margin: 0 40rpx;
		font-size: 80rpx;
		font-weight: 600;
		padding-bottom: 10rpx;
		align-items: center;
		justify-content: flex-start;

		&:after {
		}

		.mark {
			vertical-align: super;
			font-size: 40rpx;
			margin-right: 20rpx;
		}
	}
	.keepdate-picker{
		font-size: 32rpx;
		font-weight: 400;
	}

	.close {
		font-size: 80rpx;
		display: block;
		position: absolute;
		left: 10rpx;
		top: 0;
		color: #a7a7a7;
	}

	.remark {
		display: block;
		color: #7e839f;
		font-size: 28rpx;
		margin: 15rpx 0;
	}

	.r-p {
		display: flex;
		align-items: center;
		padding: 0 40rpx;

		.s-r {
			font-size: 28rpx;
			display: block;
			max-width: 605rpx;
			margin-right: 5rpx;
			box-sizing: border-box;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		image{
			width: 50rpx;
			height: 50rpx;
		}
	}

	.m-keyboard {
		display: flex;
		background: #fafafa;
		text-align: center;
		font-family: '宋体';
		font-weight: 600;

		.m-keyboard-code {
			display: flex;
			width: 562.5rpx;
			flex-wrap: wrap;

			> view {
				width: 182rpx;
				height: 100rpx;
				line-height: 100rpx;
				box-sizing: border-box;
				background: #fff;
				margin: 2rpx;
			}
		}

		.m-keyboard-tool {
			display: flex;
			width: 193.5rpx;
			flex-wrap: wrap;

			> view {
				width: 90rpx;
				height: 100rpx;
				line-height: 100rpx;
				margin: 2rpx;
				box-sizing: border-box;
				background: #fff;

				&:nth-child(odd) {
					margin-left: 0;
				}

				&.s-zo {
					width: 184rpx;
					height: 102rpx;
					line-height: 102rpx;					
				}
				&.submit-btn{
					font-size: 48rpx;
					font-family: '宋体';
					font-weight: 400;
					background: #FED845;
				}
			}
		}
	}
}

.flex {
	display: flex;
	justify-content: flex-end;
	padding-right: 30rpx;
}

.page {
	.tabs-col{
		position: fixed;
		left: 0;
		top: 0;
	}

	.category-scroll {
		box-sizing: border-box;
		padding-top: 75rpx;
		.tabs-container {
			padding: 20rpx 30rpx;
			display: flex;
			flex-wrap: wrap;
			box-sizing: border-box;
			.category {
				text-align: center;
				margin-right: 97.5rpx;
				margin-bottom: 40rpx;

				&:nth-child(4n + 0) {
					margin-right: 0;
				}

				.icon-col {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #f5f5f5;
					.iconfont{
						color: #525252;
					}
				}

				&.category-active {
					.icon-col {
						background: $uni-theme-active-icon-bgcolor;

						.iconfont {
							color: #fff !important;
						}
					}
				}

				text {
					font-size: 24rpx;
				}
			}
		}
	}
}
</style>
<style>
	page{
		background: #fff;
	}
</style>
