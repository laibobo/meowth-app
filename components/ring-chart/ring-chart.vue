<template>
	<view>
		<canvas :canvas-id="chartElementId" :id="chartElementId" class="charts"></canvas>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	let _self;
	let canvaRing=null;
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
			_self = this;
			_self.subtitle.fontSize = 15*_self.pixelRatio
			
			const monthBudgetMoney = this.monthBudgetMoney,
				monthExpendMoney = this.monthExpendMoney,
				isOverspend = monthExpendMoney > monthBudgetMoney,
				surplusBudgetMoney = monthBudgetMoney - monthExpendMoney
				
			this.surplusBudgetMoney = surplusBudgetMoney > 0? surplusBudgetMoney : 0
			
			console.log('monthExpendMoney:',this.monthExpendMoney)
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
					fontSize: 10*_self.pixelRatio,
				}
				this.subtitle.name = `${100 - Math.ceil(monthExpendMoney / monthBudgetMoney * 100)}%`				
				this.Ring.series=[{
					"name": "支出",
					"data": _self.monthExpendMoney,
					"color":'#F2F2F2'
				  },{
					 "name":"剩余",
					 "data":_self.surplusBudgetMoney,
					 "color":'#FEC240'
				  }]
			}
		},
		mounted(){
			this.cWidth=uni.upx2px(290);
			this.cHeight=uni.upx2px(290);
			_self.showRing(this.chartElementId,this.Ring)
		},
		methods:{
			showRing(canvasId,chartData){
				const title = this.title,subtitle = this.subtitle,colors = this.colors
				canvaRing = new uCharts({
					$this:_self,
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
						  ringWidth: 10 * _self.pixelRatio
						},
						tooltip:{
							showBox:false
						}
					},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
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
