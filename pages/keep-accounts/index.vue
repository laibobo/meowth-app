<template>
	<view class="page">
		<tabs class="tabs-col" :values="tabValues" :current="currentCategoryType" @clickItem="handleTabsItem"></tabs>
		<!-- 类别列表 -->
		<scroll-view class="category-scroll" :scroll-top="scrollTop" scroll-y="true" :style="getScrollHeight">
			<view class="category-col">
				<loading v-if="loading" />
				<view v-else class="tabs-container">
					<view v-for="(item, index) in categoryList" :key="index" :class="['category', { 'category-active': item._id === activeCategoryId }]" :data-id="item._id" :data-name="item.name" :data-icon="item.icon" @click="handleKeep">
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
					<image v-show="keepImage!==''" :src="keepImage" :fade-show="false" mode="aspectFit"></image>
					<text class="icon-btn icon iconfont" @click="handleKeepImage">&#xe6f3;</text><text class="split"></text>
					<text class="s-r">{{ remark }}</text>
					<text class="icon-btn icon iconfont" @click="handleOpenRemarkPanel">&#xe6f6;</text>
				</view>
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
					<view class="submit-btn s-zo" v-show="!isMoneySum" @click="handleKeyboardSubmit">完成</view>
					<view class="submit-btn s-zo" v-show="isMoneySum" @click="handleMoneySum">=</view>
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
			keepDate: '',
			money: '',
			remark: '',
			currentCategoryType: 0,
			categoryList:[],
			incomeCategoryList:[],
			expendCategoryList:[],
			loading:true,
			activeCategoryId: '',
			activeCategoryName: '',
			activeCategoryIcon:'',
			isMoneySum: false,
			isOpenKeyboard: false,
			isOpenRemarkPanel: false,
			checkedUfunc: '',
			ufuncArr: ['÷', 'x', '+', '-'],
			scrollTop:0,
			keepAccountId:'',
			parentId:'',
			keepImage:'',
			keepImageFileId:'',
			timer:null
		};
	},
	onLoad(option) {
		this.setKeepDate();
		this.DB = app.globalData.wxDB;
		if(Object.keys(option).length > 0){
			this.keepAccountId = option.keepAccountId
			this.parentId = option.parentId
			this.currentCategoryType = option.type
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
		this.getCategoryList()
		if(this.keepAccountId){
			app.globalData.wxDB.collection(this.$conf.database.keepRecord).doc(this.parentId).get()
				.then(({data,errMsg})=>{
					const keepData = data.logs.find(f=>f._id === this.keepAccountId)
					this.keepDate = keepData.keepDate
					this.money = keepData.money
					this.remark = keepData.remark
					this.activeCategoryName = keepData.categoryName
					this.activeCategoryIcon = keepData.categoryIcon
					this.activeCategoryId = keepData.categoryId
					
					if (keepData.imageFileId) {
						const _self = this
						wx.cloud.downloadFile({
							fileID: keepData.imageFileId,
							success: res => {
								_self.keepImage = res.tempFilePath
							}
						});
					}
					this.keepImageFileId = keepData.imageFileId
					this.isOpenRemarkPanel = false;
					this.isOpenKeyboard = true;
					this.calculateScrollHeight();
				}).catch(err=>{
					this.showNetworkIsError()
					console.error(err)
				})
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
		getCategoryList(){
			this.expendCategoryList = this.$store.getters.categoryExpendList,this.incomeCategoryList = this.$store.getters.categoryIncomeList
			if(this.expendCategoryList.length === 0 || this.incomeCategoryList.length === 0){			
				this.DB.collection(this.$conf.database.Category).where({
					_openid:this.getOpenid
				}).get().then(({data})=>{
					if(data.length > 0){
						const { expends,incomes } = data[0]
						this.expendCategoryList = expends
						this.incomeCategoryList = incomes
						this.categoryList = this.currentCategoryType === 0?expends:incomes
						this.$store.commit('SET_CATEGORYEXPENDLIST',expends) //支出
						this.$store.commit('SET_CATEGORYINCOMELIST',incomes) //收入
						this.calculateScrollHeight();
					}
					setTimeout(_=>{
						this.loading = false
					},1000)
				})
			}else{
				this.loading = false
				this.categoryList = this.currentCategoryType === 0?this.expendCategoryList:this.incomeCategoryList				
			}
		},
		//点击tabs项
		handleTabsItem(index) {
			if (this.currentCategoryType !== index) {
				this.currentCategoryType = index;
				this.getCategoryList()
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
		handleKeep({currentTarget}) {
			this.activeCategoryId = currentTarget.dataset.id;
			this.activeCategoryName = currentTarget.dataset.name;
			this.activeCategoryIcon = currentTarget.dataset.icon;
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
			this.setCategoryContainerHeight()
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
			this.setCategoryContainerHeight()
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
			const keepDB = this.DB.collection(this.$conf.database.keepRecord)
				,keepDate = new Date(`${this.keepDate} 00:00:00`)
				,keepWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][new Date(keepDate).getDay()]
				,categoryId = this.activeCategoryId
				,categoryType = this.currentCategoryType
				,categoryName = this.activeCategoryName
				,categoryIcon = this.activeCategoryIcon
				,remark = this.remark
				,keepMoney = parseFloat(money)
				,keepYear = keepDate.getFullYear()
				,keepMonth = keepDate.getMonth() + 1
				,keepDay = keepDate.getDate()
				,imageFileId = this.keepImageFileId
				,timestamp = Date.parse(new Date())
			
			const keepData = {
				_id: `id_${timestamp}`,
				categoryType,
				categoryIcon,
				categoryName,
				categoryId,
				imageFileId,
				money:keepMoney,
				remark,
				createTime:timestamp
			}
			//先去查询当天是否有记账记录
			keepDB.where({
				_openid:this.getOpenid,
				keepDate:this.keepDate
			}).get().then(result=>{
				let baseData = {}
				//没有记录：
				if(result.data.length === 0){
					baseData = {
						expendSum:categoryType === 0? keepMoney:0,
						incomeSum:categoryType !== 0? keepMoney:0,
						year:keepYear,
						month:keepMonth,
						day:keepDay,
						keepDate:this.keepDate,
						keepTimestamp:Date.parse(new Date(this.keepDate)),
						weekSeveral:keepWeek,
						logs:[keepData]
					}
					keepDB.add({
						data:baseData
					}).then(addRes=>{
					if (addRes.errMsg.includes('ok')) {
							uni.switchTab({
								url:'./detail'
							})
						}
					}).catch(err=>{
						this.showNetworkIsError()
						console.error(err)
					})
				}else{
					baseData = result.data[0]
					let expendSum = baseData.expendSum,incomeSum = baseData.incomeSum,logs = baseData.logs
					if(!this.keepAccountId){
						if(categoryType === 0){
							expendSum = baseData.expendSum + keepMoney
						}else{
							incomeSum = baseData.incomeSum + keepMoney
						}
						logs.push(keepData)
					}else{
						const updateDataIndex = baseData.logs.findIndex(v=>v._id === this.keepAccountId)
						,d = JSON.parse(JSON.stringify(baseData.logs[updateDataIndex]))
						if(categoryType === baseData.logs[updateDataIndex].categoryType){
							if(baseData.logs[updateDataIndex].categoryType === 0){
								expendSum = baseData.expendSum - d.money + keepMoney
							}else if(baseData.logs[updateDataIndex].categoryType === 1){
								incomeSum = baseData.incomeSum - d.money + keepMoney
							}
						}else{
							if(categoryType === 0 && baseData.logs[updateDataIndex].categoryType === 1){							
								expendSum = baseData.expendSum + keepMoney
								incomeSum = baseData.incomeSum - d.money
							}else if(categoryType === 1 && baseData.logs[updateDataIndex].categoryType === 0){								
								incomeSum = baseData.incomeSum + keepMoney
								expendSum = baseData.expendSum - d.money
							}
						}
						baseData.logs[updateDataIndex].money = keepMoney
						baseData.logs[updateDataIndex].remark = remark
						baseData.logs[updateDataIndex].categoryId = categoryId
						baseData.logs[updateDataIndex].categoryType = categoryType
						baseData.logs[updateDataIndex].categoryIcon = categoryIcon
						baseData.logs[updateDataIndex].categoryName = categoryName
						baseData.logs[updateDataIndex].imageFileId = imageFileId
						logs = baseData.logs
					}
					keepDB.doc(baseData._id).update({
						data:{
							expendSum,
							incomeSum,
							logs
						}
					}).then(updateRes =>{
						if(updateRes.errMsg.includes('ok')){
							uni.switchTab({
								url:'./detail'
							})
						}
					}).catch(err=>{
						this.showNetworkIsError()
						console.error(err)
					})
				}
			})
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
		},
		setCategoryContainerHeight(){
			if (this.timer) clearTimeout(this.timer)
			      
			this.timer = setTimeout(() => {
			    this.calculateScrollHeight()
			}, 1000)
		},
		
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

	.icon-btn {
		display: block;
		color: #7e839f;
		font-size: 42rpx;
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
.split{
	margin: 0 20rpx;
	height: 20rpx;
	border-right: 1rpx solid #ccc;
	display: inline-block;
}
</style>
<style>
	page{
		background: #fff;
	}
</style>
