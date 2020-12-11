'use strict';

const db = uniCloud.database()
const $ = db.command.aggregate
// 申明查询条件的操作符
const dbCmd = db.command

exports.main = async (event, context) => {

	const {
		user_id, // 用户id
		article_id, // 文章id
		content //评论内容
	} = event

	let user = await db.collection('user').doc(user_id).get()
	// 获取用户对象
	user = user.data[0]

	let commentObj = {
		comment_id: genID(5), //评论id
		comment_content: content, //评论内容
		create_time: new Date().getTime(), //创建时间
		author: {
			author_id: user._id, //作者id
			author_name: user.author_name, //作者名称
			avatar: user.avatar, //作者头像
			professional: user.professional, //作者专业
		},
		replys: [] //回复
	}

	await db.collection('article').doc(article_id).update({
		comments: dbCmd.unshift(commentObj)
	})

	//返回数据给客户端
	return {
		code: 200,
		msg: 'update_comment评论数据更新成功'
	}
};
// 生成id
function genID(length) {
	return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
} 

// {
// 	"code": 200,
// 	"data": {
// 		"author": {
// 			"author_id": "5fc733ca974b690001e444c9",
// 			"author_name": "Java架构师讲师团",
// 			"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
// 			"professional": "架构师"
// 		},
// 		"comment_content": "评论成功",
// 		"comment_id": "52mnjzu7uls0",
// 		"create_time": 1607599708273,
// 		"replys": []
// 	},
// 	"msg": "update_comment评论数据更新成功"
// }
