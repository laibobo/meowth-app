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
export function uploadImageFile({basePath}){
	return new Promise((resolve,reject) => {
		uni.chooseImage({
			count: 1,
			success(res) {
				const tempFilePath = res.tempFilePaths[0]
				wx.cloud.uploadFile({
					cloudPath: `${basePath}/${Date.parse(new Date())}.png`,
					filePath: tempFilePath,
					success: f => {
						resolve({
							fileId:f.fileID,
							tempFilePath
						})
					},
					fail: err=>{
						reject(err)
					}
				})
			}
		})
	})
}