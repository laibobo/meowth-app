export function getElement(elname){
	return new Promise((resolve,reject)=>{
		uni.createSelectorQuery().select(elname)
			.boundingClientRect(res => {
				resolve(res)
			}).exec();
	})
}
export function isAuthorize(){
	if(!uni.getStorageSync('isAuthSetting')){
		uni.showModal({
			title:'提示',
			content:'请先去授权登录',
			showCancel:false,
			success:function(res){
				if (res.confirm) {
				   uni.redirectTo({
					url:'../index/index'
				   })
				}
			}
		})
		return false;
	}
	return true
}