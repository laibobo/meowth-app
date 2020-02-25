<script>
const app = getApp();
const config = require('./public/config.js')
export default {
	onLaunch: function() {
		wx.cloud.init({
			env: config.cloud_env,
			traceUser: true
		});
	},
	onShow: function() {},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/*每个页面公共css */
@font-face {
  font-family: 'iconfont';  /* project id 1479363 */
  src: url('//at.alicdn.com/t/font_1479363_5yo4u342hsp.eot');
  src: url('//at.alicdn.com/t/font_1479363_5yo4u342hsp.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1479363_5yo4u342hsp.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1479363_5yo4u342hsp.woff') format('woff'),
  url('//at.alicdn.com/t/font_1479363_5yo4u342hsp.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1479363_5yo4u342hsp.svg#iconfont') format('svg');
}
.iconfont {
	font-family: 'iconfont' !important;
	font-size: 48rpx;
	color: #f5b134;
	font-weight: 500;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
page {
	font-family: 'Helvetica Neue', Helvetica, sans-serif;
	background: #f1f1f1;
}
</style>
