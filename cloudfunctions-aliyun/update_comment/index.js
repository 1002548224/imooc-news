'use strict';

const db = uniCloud.database()
const $ = db.command.aggregate
// 申明查询条件的操作符
const dbCmd = db.command

exports.main = async (event, context) => {

	const {
		user_id, // 用户id
		article_id, // 文章id
		content, //评论内容
		comment_id = '', //评论id
		reply_id = '', //子回复id
		is_reply = false //是否子回复
	} = event

	let user = await db.collection('user').doc(user_id).get()
	// 获取用户对象
	user = user.data[0]
	// 获取当前的文章信息
	const article = await db.collection('article').doc(article_id).get()
	// 获取文章下的所有评论
	const comments = article.data[0].comments
	// console.log(JSON.stringify(comments))

	/*[{
		"comment_id": "2cli9oynv7pc",
		"comment_content": "最新的评论",
		"create_time": 1607649851314,
		"author": {
			"author_id": "5fc733ca974b690001e444c9",
			"author_name": "Java架构师讲师团",
			"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
			"professional": "架构师"
		},
		"replys": []
	}, {
		"comment_id": "5yyavacavgs0",
		"comment_content": "评论456",
		"create_time": 1607600046146,
		"author": {
			"author_id": "5fc733ca974b690001e444c9",
			"author_name": "Java架构师讲师团",
			"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
			"professional": "架构师"
		},
		"replys": []
	}, {
		"comment_id": "3gvhkz0lo1g0",
		"comment_content": "评论内容123",
		"create_time": 1607600013861,
		"author": {
			"author_id": "5fc733ca974b690001e444c9",
			"author_name": "Java架构师讲师团",
			"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
			"professional": "架构师"
		},
		"replys": []
	}]*/



	let commentObj = {
		comment_id: genID(5), //评论id
		comment_content: content, //评论内容
		create_time: new Date().getTime(), //创建时间
		is_reply: is_reply, //区分主回复还是子回复
		author: {
			author_id: user._id, //作者id
			author_name: user.author_name, //作者名称
			avatar: user.avatar, //作者头像
			professional: user.professional, //作者专业
		},
		replys: [] //回复
	}

	// 表示评论文章
	if (comment_id === '') {
		commentObj.replys = []
		commentObj = dbCmd.unshift(commentObj)
	} else {
		// 回复评论

		// 获取评论索引  （评论哪条评论）
		let commentIndex = comments.findIndex(item => item.comment_id === comment_id)

		let commentAuthor = ''
		if (is_reply) {
			// 子回复
			commentAuthor = comments[commentIndex].replys.find(item => item.comment_id === reply_id)
		} else {
			// 主回复
			// 获取作者信息 （回复给谁）
			// 如果有花括号{},就需要显式的手写return   (item => { return item.comment_id === comment_id})
			// 箭头函数的特性：如果要直接return需要的内容，则不要加花括号；如果要加花括号，则需要手动添加return 
			commentAuthor = comments.find(item => item.comment_id === comment_id)
		}
		// console.log("commentIndex:", commentIndex)
		// console.log("comments[commentIndex]:", comments[commentIndex])
		// console.log("comments[commentIndex].replys:", comments[commentIndex].replys)
		// console.log("reply_id:", reply_id)
		// console.log("commentAuthor:",commentAuthor)
		commentAuthor = commentAuthor.author.author_name
		commentObj.to = commentAuthor //to 表示要回复谁
		// console.log("commentObj.to", commentObj.to)


		// 更新回复信息
		commentObj = {
			[commentIndex]: {
				replys: dbCmd.unshift(commentObj)
			}
		}
		console.log("commentObj :")
		console.log(JSON.stringify(commentObj))


		/*{
			"1": {
				"replys": {
					"operator": "unshift",
					"operands": [{
						"comment_id": "1mnru8i62rj4",
						"comment_content": "回复成功",
						"create_time": 1607932306909,
						"author": {
							"author_id": "5fc733ca974b690001e444c9",
							"author_name": "Java架构师讲师团",
							"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
							"professional": "架构师"
						},
						"replys": [],
						"to": "Java架构师讲师团"
					}],
					"fieldName": {}
				}
			}
		}*/


		/*
		
		let obj = {
			arr: [{name:1},{name:2}]
			}
		// 更新数组对象的方式 
		xxx.update({
			arr: {
				1:{
					name:3
				}
			}
		})
		
		*/
	}

	await db.collection('article').doc(article_id).update({
		comments: commentObj
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
