'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		user_id,
		author_id
	} = event
	// 查
	const user = await db.collection('user').doc(user_id).get()
	const author_likes_ids = user.data[0].author_likes_ids
	
	// 实现关注和取消关注逻辑
	let author_ids = null
	// includes() 判断数组中是否有这个值
	if(author_likes_ids.includes(author_id)){
		author_ids = dbCmd.pull(author_id)
	}else{
		author_ids = dbCmd.addToSet(author_id)
	}
	
	// 改
	await db.collection('user').doc(user_id).update({
		// addToSet() 向数组中添加值，如果数组中已存在该值，不执行任何操作。它只能在 group 阶段中使用。 
		// 如果数组没有，就添加进去；如果数组里有这个数据，就不进行任何操作
		author_likes_ids: author_ids
	})
	//返回数据给客户端
	return {
		code: 200,
		msg: '更新成功'
	}
};
