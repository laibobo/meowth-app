<script>
	const app = getApp()
	export default {
		onLaunch: function() {
			wx.cloud.init({
				env:'develop-tm3ye',
				traceUser: true
			})			
		},
		onShow: function() {
			
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@font-face {
	  font-family: 'iconfont';  /* project id 1479363 */
	  src: url('//at.alicdn.com/t/font_1479363_g3ndm8qmgad.eot');
	  src: url('//at.alicdn.com/t/font_1479363_g3ndm8qmgad.eot?#iefix') format('embedded-opentype'),
	  url('//at.alicdn.com/t/font_1479363_g3ndm8qmgad.woff2') format('woff2'),
	  url('//at.alicdn.com/t/font_1479363_g3ndm8qmgad.woff') format('woff'),
	  url('//at.alicdn.com/t/font_1479363_g3ndm8qmgad.ttf') format('truetype'),
	  url('//at.alicdn.com/t/font_1479363_g3ndm8qmgad.svg#iconfont') format('svg');
	}
	.iconfont {
	  font-family:"iconfont" !important;
	  font-size:48rpx;
	  color: #3E3E3E;
	  font-weight: 500;
	  font-style:normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}	
</style>
