export function getElement(elname){
	return new Promise((resolve,reject)=>{
		uni.createSelectorQuery().select(elname)
			.boundingClientRect(res => {
				resolve(res)
			}).exec();
	})
}