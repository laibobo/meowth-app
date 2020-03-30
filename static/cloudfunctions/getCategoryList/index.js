const cloud = require('wx-server-sdk')
cloud.init({
	env:'develop-tm3ye',
	traceUser: true
})
const db = cloud.database()

exports.main = async(event,context)=>{
	try{
		return await db.collection('Category').where({
			type:event.type,
			_openid:event._openid
		}).orderBy('sortnumber', 'asc').get()
	}catch(e){
		console.error(e)
	}  
}