const cloud = require('wx-server-sdk')
cloud.init({
	env:'develop-tm3ye',
	traceUser: true
})
const db = cloud.database()

exports.main = async(event,context)=>{
	try{
		return await db.collection('AccountsRecord').aggregate()
		.match({
			_openid:event.openid,
			keepYear: event.keepYear,
			keepMonth: event.keepMonth
		})
		.limit(1000)
		.lookup({
			from: 'Category',
			localField: 'categoryId',
			foreignField: '_id',
			as: 'categorys'
		}).end()
	}catch(e){
		console.error(e)
	}  
}