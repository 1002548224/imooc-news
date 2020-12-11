'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const {
		user_id,
		article_id
	} = event

	const list = await db.collection('article')
		.aggregate()
		.match({
			_id: article_id
		})
		// 拆分文档
		// 使用指定的数组字段中的每个元素，对文档进行拆分。拆分后，文档会从一个变为一个或多个，分别对应数组的每个元素。 
		.unwind('$comments')
		// 把指定的字段传递给下一个流水线，指定的字段可以是某个已经存在的字段，也可以是计算出来的新字段。 
		.project({
			// 不要_id, 要comments
			_id: 0,
			comments: 1
		})
		// 重新定义根节点
		// 指定一个已有字段作为输出的根节点，也可以指定一个计算出的新字段作为根节点。 
		.replaceRoot({
			newRoot: '$comments'
		})
		.end()

	//返回数据给客户端
	return {
		code: 200,
		msg: 'get_comments评论数据请求成功',
		data: list.data
	}
};

// 拆分文档后list------------------------------------------------------------------------------
// {
// 	"code": 200,
// 	"data": {
// 		"affectedDocs": 4,
// 		"data": [{
// 			"author": {
// 				"author_id": "5fc733ca974b690001e444c9",
// 				"author_name": "Java架构师讲师团",
// 				"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
// 				"professional": "架构师"
// 			},
// 			"comment_content": "评论成功",
// 			"comment_id": "52mnjzu7uls0",
// 			"create_time": 1607599708273,
// 			"replys": []
// 		}, {
// 			"author": {
// 				"author_id": "5fc733ca974b690001e444c9",
// 				"author_name": "Java架构师讲师团",
// 				"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
// 				"professional": "架构师"
// 			},
// 			"comment_content": "评论成功",
// 			"comment_id": "agn29xtljiw",
// 			"create_time": 1607599662872,
// 			"replys": []
// 		}, {
// 			"author": {
// 				"author_id": "5fc733ca974b690001e444c9",
// 				"author_name": "Java架构师讲师团",
// 				"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
// 				"professional": "架构师"
// 			},
// 			"comment_content": "评论成功",
// 			"comment_id": "2012cqcrs5j4",
// 			"create_time": 1607599584752,
// 			"replys": []
// 		}, {
// 			"author": {
// 				"author_id": "5fc733ca974b690001e444c9",
// 				"author_name": "Java架构师讲师团",
// 				"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
// 				"professional": "架构师"
// 			},
// 			"comment_content": "评论成功",
// 			"comment_id": "8lhkp6ti1e0",
// 			"create_time": 1607594155145,
// 			"replys": []
// 		}]
// 	},
// 	"msg": "get_comments评论数据请求成功"
// }
// ----------------------------------------------------------------------------------------------
// 拆分文档前list-------------------------------------------------------------------------------------
// {
// 	"code": 200,
// 	"data": {
// 		"affectedDocs": 1,
// 		"data": [{
// 			"comments": [{
// 				"author": {
// 					"author_id": "5fc733ca974b690001e444c9",
// 					"author_name": "Java架构师讲师团",
// 					"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
// 					"professional": "架构师"
// 				},
// 				"comment_content": "评论成功",
// 				"comment_id": "52mnjzu7uls0",
// 				"create_time": 1607599708273,
// 				"replys": []
// 			}, {
// 				"author": {
// 					"author_id": "5fc733ca974b690001e444c9",
// 					"author_name": "Java架构师讲师团",
// 					"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
// 					"professional": "架构师"
// 				},
// 				"comment_content": "评论成功",
// 				"comment_id": "agn29xtljiw",
// 				"create_time": 1607599662872,
// 				"replys": []
// 			}, {
// 				"author": {
// 					"author_id": "5fc733ca974b690001e444c9",
// 					"author_name": "Java架构师讲师团",
// 					"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
// 					"professional": "架构师"
// 				},
// 				"comment_content": "评论成功",
// 				"comment_id": "2012cqcrs5j4",
// 				"create_time": 1607599584752,
// 				"replys": []
// 			}, {
// 				"author": {
// 					"author_id": "5fc733ca974b690001e444c9",
// 					"author_name": "Java架构师讲师团",
// 					"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
// 					"professional": "架构师"
// 				},
// 				"comment_content": "评论成功",
// 				"comment_id": "8lhkp6ti1e0",
// 				"create_time": 1607594155145,
// 				"replys": []
// 			}]
// 		}]
// 	},
// 	"msg": "get_comments评论数据请求成功"
// }
