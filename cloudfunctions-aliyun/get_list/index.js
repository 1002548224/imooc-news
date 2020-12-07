'use strict';
// 获取数据库的引用
const db = uniCloud.database()
exports.main = async (event, context) => {
	// 接受分类，通过分类筛选数据
	const {
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
	// 聚合： 更精细化的去处理数据 求和、分组、指定返回哪些字段
	const list = await db.collection('article')
		.aggregate()
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
