<template>
	<view class="page">
		<view class="tabs">
			<view :class="['tabs-item', { active: currentCategoryType === 0 }]" @click="handleTabsItem(0)">支出</view>
			<view :class="['tabs-item', { active: currentCategoryType === 1 }]" @click="handleTabsItem(1)">收入</view>
		</view>
		<!-- 类别列表 -->
		<scroll-view class="category-scroll" scroll-y="true" :style="getScrollHeight">
			<view class="tabs-container">
				<view v-for="(item, index) in dataList" :key="index" :class="['category', { active: item._id === activeCategoryId }]" @click="handleKeep(item._id)">
					<view class="icon-col"><view class="icon iconfont" v-html="item.icon"></view></view>
					<text class="explain">{{ item.name }}</text>
				</view>
				<view class="category" @click="handleDeploy">
					<view class="icon-col"><view class="icon iconfont">&#xe6df;</view></view>
					<text class="explain">设置</text>
				</view>
			</view>
		</scroll-view>
		<!-- 记账面板 -->
		<view class="keep-panel" v-if="isOpenKeyboard">
			<view class="form">
				<view class="flex">
					<picker class="keepdate-picker" mode="date" :value="keepDate" @change="handleKeepDateChange">
						<view class="uni-input">{{ showKeepDate }}</view>
					</picker>
				</view>
				<view class="money-col">
					<text class="mark">￥</text>
					<text>{{ money }}</text>
					<text class="m-focus"></text>
				</view>
				<view class="r-p">
					<text class="s-r">{{ remark }}</text>
					<text class="remark" @click="handleOpenRemarkPanel">{{ optRemarkBtnText }}</text>
				</view>
			</view>
			<view class="m-keyboard">
				<view class="m-keyboard-code">
					<view @click="handleKeyCode" data-code="1">1</view>
					<view @click="handleKeyCode" data-code="2">2</view>
					<view @click="handleKeyCode" data-code="3">3</view>
					<view @click="handleKeyCode" data-code="4">4</view>
					<view @click="handleKeyCode" data-code="5">5</view>
					<view @click="handleKeyCode" data-code="6">6</view>
					<view @click="handleKeyCode" data-code="7">7</view>
					<view @click="handleKeyCode" data-code="8">8</view>
					<view @click="handleKeyCode" data-code="9">9</view>
					<view @click="handleKeyCode" data-code=".">.</view>
					<view @click="handleKeyCode" data-code="0">0</view>
					<view @click="handleDeleteKeyCode"><view class="icon iconfont">&#xe6eb;</view></view>
				</view>
				<view class="m-keyboard-tool">
					<view @click="handleUfuncCode('+')">+</view>
					<view @click="handleUfuncCode('-')">-</view>
					<view @click="handleUfuncCode('x')">x</view>
					<view @click="handleUfuncCode('÷')">÷</view>
					<view class="submit-btn" v-if="!isMoneySum" @click="handleKeyboardSubmit">完成</view>
					<view class="submit-btn" v-else @click="handleMoneySum">=</view>
				</view>
			</view>
			<view class="icon iconfont close" @click="handleClose">&#xe6e6;</view>
		</view>
		<!-- 备注面板 -->
		<remark-panel
			class="remarkp"
			:visible.sync="isOpenRemarkPanel"
			:content="remark"
			@confirm="handleConfirmRemark"
			@close="handleCancelRemark" />
	</view>
</template>

<script>
import RemarkPanel from './remark-panel.vue'
export default {
	components:{
		RemarkPanel
	},
	data() {
		return {
			tabsHeight: 0,
			windowHeight: 0,
			scrollHeight: 0,
			showKeepDate: '',
			keepDate: '',
			money: '',
			remark: '',
			currentCategoryType: 0,
			dataList: [],
			activeCategoryId: '',
			isMoneySum:false,
			isOpenKeyboard: false,
			isOpenRemarkPanel: false,
			checkedUfunc: '',
			ufuncArr:['÷','x','+','-']
		};
	},
	onLoad() {
		this.getCategoryList();
		const nowDate = new Date();
		const year = nowDate.getFullYear();
		const month = nowDate.getMonth();
		const day = nowDate.getDate();
		this.keepDate = `${year}-${month}-${day}`;
		this.showKeepDate = `${year}年${month}月${day}日`;
	},
	onShow() {
		const _this = this;
		//获取tabs组件的高度，由此来计算scroll-view组件的高度
		uni.createSelectorQuery()
		.select('.tabs')
		.boundingClientRect(e => {
			_this.tabsHeight = e.height;
			uni.getSystemInfo({
				success: function(res) {
					const scrollHeight = res.windowHeight - _this.tabsHeight;
					_this.scrollHeight = scrollHeight;
					_this.windowHeight = scrollHeight;
				}
			});
		})
		.exec();
	},
	computed: {
		getScrollHeight() {
			return `height:${this.scrollHeight}px;`;
		},
		optRemarkBtnText() {
			return this.remark === '' ? '添加备注' : '修改';
		}
	},
	methods: {
		/**
		 * 获取类目数据
		 * */
		getCategoryList() {
			const type = this.currentCategoryType;
			wx.cloud
				.callFunction({
					name: 'getCategoryList',
					data: {
						type
					}
				})
				.then(({ result }) => {
					this.dataList = result.data;
				})
				.catch(console.error);
		},
		/**
		 * 点击tabs项
		 * */
		handleTabsItem(index) {
			if (this.currentCategoryType !== index) {
				this.currentCategoryType = index;
				this.getCategoryList();
			}
		},
		/**
		 * 设置类目  跳转类目管理页面
		 * */
		handleDeploy() {
			const categoryType = this.currentCategoryType;
			uni.navigateTo({
				url: '../category-config/index?categoryType=' + categoryType
			});
		},
		/**
		 * 点击类目
		 * */
		handleKeep(id) {
			this.activeCategoryId = id;
			this.isOpenKeyboard = true
			this.isOpenRemarkPanel = false
			this.calculateScrollHeight();
		},
		//计算列表容器高度
		calculateScrollHeight() {
			let panelClass,isOpt = false
			
			if(this.isOpenKeyboard){
				panelClass = '.keep-panel'
			}
			if(this.isOpenRemarkPanel){
				panelClass = '.remarkp'
			}
			
			if (panelClass!=undefined) {
				setTimeout(_ => {
					uni.createSelectorQuery()
						.select(panelClass)
						.boundingClientRect(e => {
							this.scrollHeight = this.windowHeight - e.height;
						})
						.exec();
				});
			}
		},
		handleOpenRemarkPanel() {
			this.isOpenRemarkPanel = true
			this.isOpenKeyboard = false
			this.calculateScrollHeight()
		},
		handleCancelRemark() {
			this.isOpenKeyboard = true
			this.calculateScrollHeight()
			if (this.optRemarkBtnText === '修改') {
				return;
			}
			this.remark = '';
		},
		handleConfirmRemark(value) {
			this.isOpenKeyboard = true
			this.calculateScrollHeight()
			this.remark = value
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
			const ufuncArr = this.ufuncArr
			const moneyRule = /^[0-9]+(\.?)([0-9]{1,2})?$/;
			const isNumberRule = /[0-9]\d*/;
			const moneyStr = this.money.toString();
			const moneyStrLength = moneyStr.length - 1;

			if (moneyStr !== '' && !isNumberRule.test(code) && moneyStr.indexOf('.') === moneyStrLength) {
				return;
			}
			const tepMoney = moneyStr + code;
			this.isMoneySum = /\d+([+x÷-]\d+)+/.test(tepMoney)
			
			const lastChar = moneyStr.substring(moneyStrLength);
			
			if(/[+x÷-]/.test(lastChar)){
				if(code === '.'){
					return;
				}				
			} else {
				const isStartZero = moneyStr.length === 1 && moneyStr.indexOf('0') > -1;
				if ((isStartZero && code === '0') || (isStartZero && isNumberRule.test(code))) {
					return;
				}
				
				let isNoPass = true
				let isIncludeUfunc = false
				for (let i = 0; i < ufuncArr.length; i++) {
					const ufunc = ufuncArr[i]
					if(tepMoney.indexOf(ufunc) > -1){
						isIncludeUfunc = true
						this.checkedUfunc = ufunc;
						const splitArr = tepMoney.split(ufunc);
						if(!moneyRule.test(splitArr[1])){
							isNoPass = false
						}
						break
					}
				}
				if(!isNoPass || (!isIncludeUfunc && !moneyRule.test(tepMoney))){
					return;
				}
			}
			this.money = tepMoney;
		},
		handleUfuncCode(code) {
			const moneyStr = this.money.toString();
			const lastChar = moneyStr.substring(moneyStr.length - 1);			
			if(/[+x÷-]/.test(lastChar) || lastChar === '.'){
				return;
			}
			const ufuncArr = this.ufuncArr
			let isMoneyCount = false
			for(let i = 0;i < ufuncArr.length;i++){
				const ufunc = ufuncArr[i]
				if(lastChar !== ufunc && moneyStr.indexOf(ufunc) > -1 && ufuncArr.indexOf(code) > -1){					
					isMoneyCount = true
					this._sumMoney(moneyStr,ufunc,code)
					break
				}
			}
			if(isMoneyCount){
				return
			}
			this.money = moneyStr + code;
		},
		/**
		 * =按钮操作 金额合计
		 * */
		handleMoneySum(){
			const ufuncArr = this.ufuncArr
			const moneyStr = this.money.toString()
			for(let i = 0;i < ufuncArr.length;i++){
				const ufunc = ufuncArr[i]
				if(moneyStr.indexOf(ufunc) > -1){					
					this._sumMoney(moneyStr,ufunc)
					break
				}
			}
			this.isMoneySum = false
		},
		/**
		 * 自定义键盘-关闭
		 * */
		handleClose() {
			this.isOpenKeyboard = false;
			this.activeCategoryId = '';
			this.scrollHeight = this.windowHeight;
		},
		/**
		 * 自定义键盘-完成操作
		 * */
		handleKeyboardSubmit() {
			this.isOpenKeyboard = false;
			this.scrollHeight = this.windowHeight;
		},
		/**
		 * 选择账单日期
		 * */
		handleKeepDateChange(e) {
			const date = e.detail.value;
			const dateArr = date.split('-');
			this.keepDate = date;
			this.showKeepDate = `${dateArr[0]}年${dateArr[1]}月${dateArr[2]}日`;
		},
		_sumMoney(moneyStr,ufunc,code=''){
			const splitArr = moneyStr.split(ufunc)
			let moneyCount = 0
			const number1 = Number(splitArr[0])
			const number2 = Number(splitArr[1])
			switch(ufunc){
				case '+':
					moneyCount = number1 + number2
				break;
				case '-':
					moneyCount = number1 - number2
				break;
				case 'x':
					moneyCount = number1 * number2
				break;
				case '÷':
					moneyCount = number1 / number2
				break;
			}
			this.money =`${Math.floor(moneyCount * 100) / 100}${code}`
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
.m-focus {
	height: 100rpx;
	border: 1rpx solid #eee;
	margin-left: 15rpx;
	margin-top: 60rpx;
	content: '';
	border: 1px solid #dcdcdc;
	transform-origin: 0 0;
	transform: scale(0.5, 0.5);
	box-sizing: border-box;
	animation: blink 1s linear infinite;
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
	padding-top: 20rpx;
	.money-col {
		display: flex;
		font-size: 50rpx;
		color: #000;
		border-bottom: 2rpx solid #dbdbdb;
		margin: 20rpx 40rpx 0;
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
	.keepdate-picker {
		background: #eaeaea;
		height: 70rpx;
		line-height: 70rpx;
		border-radius: 25rpx;
		font-size: 32rpx;
		.uni-input {
			position: relative;
			padding: 0 40rpx 0 20rpx;
			&:before {
				content: '';
				display: block;
				width: 0;
				height: 0;
				border-width: 10rpx;
				border-style: solid;
				border-color: #c8c8c8 transparent transparent transparent;
				position: absolute;
				top: 50%;
				right: 18rpx;
			}
		}
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
				&.submit-btn {
					width: 184rpx;
					height: 204rpx;
					line-height: 204rpx;
					background: $uni-theme-bg-color;
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
	padding-top: 35px;
	.tabs {
		display: flex;
		width: 750rpx;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		background: $uni-theme-bg-color;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 10;
		.tabs-item {
			width: 120rpx;
			font-size: 32rpx;
			height: 70rpx;
			text-align: center;
			border-bottom: 1px solid $uni-theme-active-color;
			box-sizing: border-box;
			&.active {
				border-color: #000;
			}
		}
	}
	.category-scroll {
		box-sizing: border-box;
		.tabs-container {
			padding: 20rpx 30rpx;
			display: flex;
			flex-wrap: wrap;
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
				}
				&.active {
					.icon-col {
						background: $uni-theme-bg-color;
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
