<template>
	<view v-if="visible">
		<view class="keep-panel" v-if="!isOpenRemarkPanel">
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
			<!-- 自定义键盘 -->
			<view class="m-keyboard">
				<view class="m-keyboard-code">
					<view @click="handleKeyCode" v-for="(item,index) in keyboardCodeArr" :key="index" :data-code="item">{{item}}</view>
					<view @click="handleDeleteKeyCode">
						<view class="icon iconfont">&#xe6eb;</view>
					</view>
				</view>
				<view class="m-keyboard-tool">
					<view @click="handleUfuncCode(item)" v-for="item in ufuncArr" :key="item">{{item}}</view>
					<view class="submit-btn" v-if="!isMoneySum" @click="handleComplete">完成</view>
					<view class="submit-btn" v-else @click="handleMoneySum">=</view>
				</view>
			</view>
			<view class="icon iconfont close" @click="handleClose">&#xe6e6;</view>
		</view>
		<!-- 备注面板 -->
		<remark-panel class="remarkp" :visible.sync="isOpenRemarkPanel" :content="remark" @confirm="handleRemarkConfirm" />
	</view>
</template>

<script>
	import RemarkPanel from './remark-panel.vue'
	/**
	 * 记账面板
	 * visible 是否显示，支持 .sync 修饰符
	 * @complete 完成事件
	 * @close 关闭事件
	 * @cutPanel 切换面板事件
	 * */
	export default {
		name: 'keep-panel',
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		components: {
			RemarkPanel
		},
		data() {
			return {
				keyboardCodeArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0],
				ufuncArr: ['÷', 'x', '+', '-'],
				showKeepDate: '',
				keepDate: '',
				money: '',
				remark: '',
				isMoneySum: false,
				isOpenRemarkPanel: false
			}
		},
		created() {
			this._setDefaultKeepDate()
		},
		watch:{
			visible(newVisible,oldVisible){
				this.money = ''
				this.remark = ''
				this._setDefaultKeepDate()
			}
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
				let v_code = isNumberRule.test(code) ? Number(code) : code
				const tepMoney = moneyStr + v_code;
				const lastChar = moneyStr.substring(moneyStrLength);
				this.isMoneySum = /\d+([+x÷-]\d+)+/.test(tepMoney)

				if (/[+x÷-]/.test(lastChar)) {
					if (code === '.') {
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
						if (tepMoney.indexOf(ufunc) > -1) {
							isIncludeUfunc = true
							this.checkedUfunc = ufunc;
							const splitArr = tepMoney.split(ufunc);
							if (!moneyRule.test(splitArr[1])) {
								isNoPass = false
							}
							break
						}
					}
					if (!isNoPass || (!isIncludeUfunc && !moneyRule.test(tepMoney))) {
						return;
					}
				}
				this.money = tepMoney;
			},
			//键盘删除字符
			handleDeleteKeyCode() {
				const moneyStr = this.money.toString();
				if (moneyStr === '') {
					return;
				}
				const deleteCharIndex = moneyStr.length - 1;
				this.money = moneyStr.substring(0, deleteCharIndex);
			},
			//键盘-输入运算符
			handleUfuncCode(code) {
				const moneyStr = this.money.toString();
				const lastChar = moneyStr.substring(moneyStr.length - 1);
				if (/[+x÷-]/.test(lastChar) || lastChar === '.') {
					return;
				}
				const ufuncArr = this.ufuncArr
				let isMoneyCount = false
				for (let i = 0; i < ufuncArr.length; i++) {
					const ufunc = ufuncArr[i]
					if (lastChar !== ufunc && moneyStr.indexOf(ufunc) > -1 && ufuncArr.indexOf(code) > -1) {
						isMoneyCount = true
						this._sumMoney(moneyStr, ufunc, code)
						break
					}
				}
				if (isMoneyCount) {
					return
				}
				this.money = moneyStr + code;
			},
			//选择账单日期
			handleKeepDateChange(e) {
				const date = e.detail.value;
				const dateArr = date.split('-');
				this.keepDate = date;
				this.showKeepDate = `${dateArr[0]}年${dateArr[1]}月${dateArr[2]}日`;
			},
			//打开备注面板
			handleOpenRemarkPanel() {
				this.isOpenRemarkPanel = true
			},
			//金额求和
			handleMoneySum() {
				const ufuncArr = this.ufuncArr
				const moneyStr = this.money.toString()
				for (let i = 0; i < ufuncArr.length; i++) {
					const ufunc = ufuncArr[i]
					if (moneyStr.indexOf(ufunc) > -1) {
						this._sumMoney(moneyStr, ufunc)
						break
					}
				}
				this.isMoneySum = false
			},
			//完成操作
			handleComplete() {
				const money = this.money.toString().replace(/[\.+x÷-]$/, '')
				if (money === '' || Number(money) === 0) {
					return
				}
				const keepDate = this.keepDate
				const remark = this.remark
				this.$emit('complete', {
					money,
					keepDate,
					remark
				})
			},
			handleRemarkConfirm(value) {
				this.remark = value
			},
			//关闭
			handleClose() {
				this.$emit('update:visible', false)
				this.$emit('close')
			},
			_sumMoney(moneyStr, ufunc, code = '') {
				const splitArr = moneyStr.split(ufunc)
				let moneyCount = 0
				const number1 = Number(splitArr[0])
				const number2 = Number(splitArr[1])
				switch (ufunc) {
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
				this.money = `${Math.floor(moneyCount * 100) / 100}${code}`
			},
			_setDefaultKeepDate() {
				const nowDate = new Date();
				const year = nowDate.getFullYear();
				let month = nowDate.getMonth() + 1;
				let day = nowDate.getDate();
				if (month < 10) {
					month = '0' + month
				}
				if (day < 10) {
					day = '0' + day
				}
				this.keepDate = `${year}-${month}-${day}`;
				this.showKeepDate = `${year}年${month}月${day}日`;
			},
			_getPanelHeight(clsName){
				setTimeout(_=>{
					uni.createSelectorQuery().select(clsName).boundingClientRect(e=>{
						console.log(e)
					}).exec();
				})
			}
		}
	}
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

	.flex {
		display: flex;
		justify-content: flex-end;
		padding-right: 30rpx;
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

			&:after {}

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

				>view {
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

				>view {
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
</style>
