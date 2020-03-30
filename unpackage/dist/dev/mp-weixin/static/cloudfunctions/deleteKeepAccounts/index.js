const cloud = require('wx-server-sdk')
cloud.init({
	env:'develop-tm3ye',
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