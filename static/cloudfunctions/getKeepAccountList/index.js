const cloud = require('wx-server-sdk')
cloud.init({
	env:'production-5g1k6p3j1948d18f',
	traceUser: true
})
const db = cloud.database()

exports.main = async(event,context)=>{
	try{
		return await db.collection('KeepRecord').where({
			_openid:event.openid,
			year: Number(event.keepYear),
			month: Number(event.keepMonth) 
		})
		.limit(1000).get()
	}catch(e){
		console.error(e)
	}  
}