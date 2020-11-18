<template>
	<view>
		<canvas :canvas-id="chartElementId" :id="chartElementId" class="charts"></canvas>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	export default {
		props:{
			chartElementId:{
				type:String,
				default:'canvasRing_001'
			}
		},
		data() {
			return {
				surplusBudgetMoney:0,
				cWidth:0,
				cHeight:0,
				pixelRatio:1,
				title: {},
				subtitle:{
					name:'70%',
					fontSize:'',
					color: '#000000'
				},
				colors:['#F2F2F2'],
				Ring:{
					series:[{
					"name": "全部",
					"data": 0
				  }]
				}
			};
		},
		mounted(){
			this.cWidth = uni.upx2px(290)
			this.cHeight = uni.upx2px(290)
			this.showRing()
		},
		watch:{
			getLodingChartPageCode(newValue,oldValue){
				this.showRing()
			}
		},
		computed:{
			getLodingChartPageCode(){
				return this.$store.getters.currentLoadingChartPageCode
			}
		},
		methods:{
			showRing(){
				this.subtitle.fontSize = 15 * this.pixelRatio
				
				let monthBudgetMoney = this.getMonthBudgetMoney,
					monthExpendMoney = this.getMonthExpendMoney,
					isOverspend = monthExpendMoney > monthBudgetMoney,
					canvasId = this.chartElementId
					
				if(monthBudgetMoney <= 0){
					this.subtitle.name = '0%'
					this.subtitle.color = '#A0A0A0'
					monthExpendMoney = 0
				}else if(isOverspend){
					this.subtitle.name = '已超支'
					this.subtitle.color = '#E06C73'
				}else if(monthBudgetMoney > 0){
					this.title = {
						name: `剩余`,
						color: '#A0A0A0',
						fontSize: 10 * this.pixelRatio,
					}
					this.subtitle.name = `${100 - Math.ceil(monthExpendMoney / monthBudgetMoney * 100)}%`				
					this.Ring.series=[{
						"name": "支出",
						"data": monthExpendMoney,
						"color":'#F2F2F2'
					  },{
						 "name":"剩余",
						 "data":this.getSurplusBudgetMoney,
						 "color":'#FEC240'
					  }]
				}
				const chartData = this.Ring, title = this.title, subtitle = this.subtitle, colors = this.colors
				
				new uCharts({
					$this:this,
					canvasId,
					type: 'ring',
					position:'left',
					float:'center',
					padding:0,
					margin:0,
					colors,
					title,
					subtitle,
					extra: {
						pie: {
						  ringWidth: 10 * this.pixelRatio
						},
						tooltip:{
							showBox:false
						}
					},
					background:'#FFFFFF',
					pixelRatio:this.pixelRatio,
					series: chartData.series,
					animation: true,
					width: this.cWidth*this.pixelRatio,
					height: this.cHeight*this.pixelRatio,
					disablePieStroke: true,
					dataLabel:false,
					legend:{
						show:false
					}
				});
			}
		}
	}
</script>
