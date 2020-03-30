const cloud = require('wx-server-sdk')
cloud.init({
	env:'develop-tm3ye',
	traceUser: true
})
const db = cloud.database()
const $ = db.command.aggregate

exports.main = async(event,context)=>{
	try{
		return await db.collection('AccountsRecord').aggregate()
		.match({
			_openid:event.openid,
			keepYear: event.keepYear,
			keepMonth: event.keepMonth
		}).group({
			_id:'$categoryType',
			keepMoney:$.sum('$keepMoney')
		}).end()
	}catch(e){
		console.error(e)
	}  
}