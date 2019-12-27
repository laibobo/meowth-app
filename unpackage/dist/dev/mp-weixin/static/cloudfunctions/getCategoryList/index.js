const cloud = require('wx-server-sdk')
cloud.init({
	env:'develop-tm3ye',
	traceUser: true
})
const db = cloud.database()

exports.main = async(event,context)=>{
	try{
		return await db.collection('Category').where({
			type:event.type
		}).get()
	}catch(e){
		//TODO handle the exception
		console.error(e)
	}  
}