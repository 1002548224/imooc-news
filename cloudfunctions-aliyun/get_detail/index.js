'use strict';
// 获取数据库的引用
const db = uniCloud.database()
// 聚合操作符
const $ = db.command.aggregate
exports.main = async (event, context) => {
	
	const {
		user_id,
		article_id
	} = event
	
	// 获取用户信息
	let user = await db.collection('user').doc(user_id).get()
	user = user.data[0]
	// console.log(user)
	let list = await db.collection('article')
	.aggregate()
	.addFields({
		// 是否关注作者
		//  $.in(): 给定一个值和一个数组，如果值在数组中则返回 true，否则返回 false。 
		is_author_like: $.in(['$author.id', user.author_likes_ids]),
		// 是否收藏文章
		is_like: $.in(['$_id', user.article_likes_ids]),
		// 是否点赞
		is_thumbs_up: $.in(['$_id',user.thumbs_up_article_ids])
	})
	// 筛选数据——根据条件过滤文档，并且把符合条件的文档传递给下一个流水线阶段。 
	// 只筛选当前id——传进来的文章id的一条数据
	.match({
		_id: article_id
	})
	// 把指定的字段传递给下一个流水线，指定的字段可以是某个已经存在的字段，也可以是计算出来的新字段。 
	.project({
		// 评论
		comments: 0
	})
	// 标志聚合操作定义完成，发起实际聚合操作 
	.end()
	
	//返回数据给客户端
	return {
		code: 200,
		msg: 'get_detail数据请求成功',
		data: list.data[0]
	}
};
