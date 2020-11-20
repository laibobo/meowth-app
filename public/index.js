export function getElement(elname){
	return new Promise((resolve,reject)=>{
		uni.createSelectorQuery().select(elname)
			.boundingClientRect(res => {
				resolve(res)
			}).exec();
	})
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
const config = require('@/public/config').default
export function setSoundEffects(soundName,volume,loop=false){
		const innerAudioContext = uni.createInnerAudioContext()
		innerAudioContext.src = config.audio[soundName]
		innerAudioContext.autoplay = true
		innerAudioContext.loop = loop
		innerAudioContext.volume = volume || 0.4
		innerAudioContext.onEnded = ()=>{			
			innerAudioContext.destroy()
		}
	}