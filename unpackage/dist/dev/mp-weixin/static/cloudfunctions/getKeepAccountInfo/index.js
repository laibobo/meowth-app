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
			_id:event.keepAccountId
		})
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