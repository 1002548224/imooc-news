'use strict';
// 获取数据库的引用
const db = uniCloud.database()
// 申明聚合操作符
const $ = db.command.aggregate
exports.main = async (event, context) => {
	// 接受分类，通过分类筛选数据
	const {
		user_id,
		name,
		page = 1,
		pageSize = 10
	} = event
	// var name = event.name   该写法和上述写法作用一样

	let matchObj = {}
	if (name !== '全部') {
		matchObj = {
			classify: name
		}
	}
	const userinfo = await db.collection('user').doc(user_id).get()
	const article_likes_ids = userinfo.data[0].article_likes_ids

	// 聚合： 更精细化的去处理数据 求和、分组、指定返回哪些字段
	const list = await db.collection('article')
		.aggregate()
		// 返回一个字段，追加字段
		.addFields({
			// $.in 表示当前的某个数组里是否包含了某个字段
			is_like: $.in(['$_id', article_likes_ids])
		})
		.match(matchObj)
		.project({
			content: 0
		})
		// 计算要跳过多少数据
		.skip(pageSize * (page - 1))
		.limit(pageSize)
		.end()
	// -------------------------------------------------------
	// 普通的数据查询
	// const list = await db.collection('article')
	// 	// .field()可指定返回的字段
	// 	.field({
	// 		// true 表示只返回这个字段， false 表示不返回
	// 		content: false //过滤掉content，不让content返回
	// 	})
	// 	.get()
	// -------------------------------------------------------

	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data
	}
};
