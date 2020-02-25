const cloud = require('wx-server-sdk')
const config = require('@/public/config.js')
cloud.init({
	env:config.cloud_env,
	traceUser: true
})
const db = cloud.database()

exports.main = async(event,context)=>{
	try{
		return await db.collection('AccountsRecord').where({
			categoryId:event.categoryId,
			_openid:event.openid
		}).remove()
	}catch(e){
		console.error(e)
	}  
}