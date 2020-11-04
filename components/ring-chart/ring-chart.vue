<template>
	<view>
		<canvas :canvas-id="chartElementId" :id="chartElementId" class="charts" />
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	export default {
		props:{
			//本月预算
			monthBudgetMoney:{
				type:Number,
				required:true
			},
			//本月支出
			monthExpendMoney:{
				type:Number,
				required:true
			},
			//图表id
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
		created(){
			
		},
		mounted(){
			this.cWidth=uni.upx2px(290)
			this.cHeight=uni.upx2px(290)
			this.showRing(this.chartElementId)
		},
		methods:{
			showRing(canvasId){
				this.subtitle.fontSize = 15 * this.pixelRatio
				
				const monthBudgetMoney = this.monthBudgetMoney,
					monthExpendMoney = this.monthExpendMoney,
					isOverspend = monthExpendMoney > monthBudgetMoney,
					surplusBudgetMoney = monthBudgetMoney - monthExpendMoney
					
				this.surplusBudgetMoney = surplusBudgetMoney > 0? surplusBudgetMoney : 0
				
				if(monthBudgetMoney <= 0){
					this.subtitle.name = '0%'
					this.subtitle.color = '#A0A0A0'
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
						"data": this.monthExpendMoney,
						"color":'#F2F2F2'
					  },{
						 "name":"剩余",
						 "data":this.surplusBudgetMoney,
						 "color":'#FEC240'
					  }]
				}
				const chartData = this.Ring
				const title = this.title,subtitle = this.subtitle,colors = this.colors
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
