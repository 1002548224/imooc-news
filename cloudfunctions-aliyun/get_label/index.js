'use strict';
// 获取数据库的引用
const db = uniCloud.database()
// 获取聚合操作符
const $ = db.command.aggregate
// event 就是调用云函数时传入的参数，context 对象包含了此处调用的调用信息和运行状态
exports.main = async (event, context) => {
	// 拿到用户表
	const {
		user_id,
		type
	} = event
	let matchObj = {}
	if(type !== 'all'){
		matchObj = {
			current: true
		}
	}
	// ###############1. 获取user表里的数据
	let userinfo = await db.collection('user').doc(user_id).get()
	userinfo = userinfo.data[0]
	// label_ids = ['label.id']

	// 获取label表的数据
	// let label = await db.collection('label').get()
	let label = await db.collection('label')             //################2. 使用聚合获取label表里的内容
		// 获取数据库集合的聚合操作实例 
		.aggregate()
		// 添加一个字段
		.addFields({
			// 在数组里查找是否存在某一项 $表示当前记录的内容
			// ifNull: 计算给定的表达式，如果表达式结果为 null、undefined 或者不存在，那么返回一个替代值；否则返回原值。参数形式为：[表达式,替代值] 
			// ########################3. 每个记录加入current字段； current字段通过id在user表里的label_ids里寻找，label表的id是否在user表的label_ids里，如果有，current返回true；如果没有，返回false；
			current: $.in(['$_id', $.ifNull([userinfo.label_ids, []])])  //如果该用户ID里有label_ids的值，则为真
		})
		// 根据条件过滤文档，并且把符合条件的文档传递给下一个流水线阶段。 
		// ###################4. 用match添加判断，如果current是true，就只返回“我的标签”内容。通过type进行判断
		.match(matchObj)  //筛选出current值为真的data
		// 标志聚合操作定义完成，发起实际聚合操作 
		.end()

	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: label.data
	}
};

// {
// 	"code": 200,
// 	"data": [{
// 		"_id": "5fc733c8e2c1ee00012d9ed5",
// 		"current": false,
// 		"name": "后端开发",
// 		"user": []
// 	}, {
// 		"_id": "5fc733c8e2c1ee00012d9ed6",
// 		"current": false,
// 		"name": "职场生活",
// 		"user": []
// 	}, {
// 		"_id": "5fc733c8e2c1ee00012d9ed7",
// 		"current": false,
// 		"name": "前端开发",
// 		"user": []
// 	}, {
// 		"_id": "5fc733c8e2c1ee00012d9ed8",
// 		"current": false,
// 		"name": "人工智能",
// 		"user": []
// 	}, {
// 		"_id": "5fc733c8e2c1ee00012d9ed9",
// 		"current": false,
// 		"name": "移动开发",
// 		"user": []
// 	}, {
// 		"_id": "5fc733c8e2c1ee00012d9eda",
// 		"current": false,
// 		"name": "其它",
// 		"user": []
// 	}],
// 	"msg": "数据请求成功"
// }
