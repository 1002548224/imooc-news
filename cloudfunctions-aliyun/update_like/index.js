'use strict';
const db = uniCloud.database()
//  command 数据库操作符 
const dbCmd = db.command

exports.main = async (event, context) => {
	const {
		user_id,
		article_id
	} = event
	// 获取
	// doc() 获取集合中指定记录的引用。方法接受一个 id 参数，指定需引用的记录的 _id 
	const userInfo = await db.collection('user').doc(user_id).get()
	const article_id_ids = userInfo.data[0].article_likes_ids
	console.log(userInfo)
	// ------------------------------------------------------------------------------------------
	// userInfo：
	// {
	// 	"code": 200,
	// 	"data": {
	// 		"_id": "5fc733ca974b690001e444c9",
	// 		"article_ids": ["302042", "301911"],
	// 		"article_likes_ids": ["5fc733c7fb0f8500017999ae", "5fc733c7fb0f8500017999ad"],
	// 		"author_likes_ids": [],
	// 		"author_name": "Java架构师讲师团",
	// 		"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
	// 		"explain": "架构师成长沟通群878622640，欢迎加入~",
	// 		"fans_count": 0,
	// 		"follow_count": 0,
	// 		"gender": "男",
	// 		"id": "8010388",
	// 		"integral_count": "",
	// 		"professional": "架构师",
	// 		"status": "normal",
	// 		"thumbs_up_article_ids": []
	// 	},
	// 	"msg": "数据请求成功"
	// }
    // --------------------------------------------------------------------------------------------
	// 判断articles_like_ids数组里是否存在article_id值
	let dbCmdFuns = null
	if (article_id_ids.includes(article_id)) {
		// 如果存在，则删除
		dbCmdFuns = dbCmd.pull(article_id)
	} else {
		// 如果不存在，则添加
		// addToSet() 向数组中添加值，如果数组中已存在该值，不执行任何操作。它只能在 group 阶段中使用。 
		dbCmdFuns = dbCmd.addToSet(article_id)
	}

	// 更新
	await db.collection('user').doc(user_id).update({
		article_likes_ids: dbCmdFuns
	})
	console.log('event : ', event)

	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: userInfo.data[0]
	}
};
