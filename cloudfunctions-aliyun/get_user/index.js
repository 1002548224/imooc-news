'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const {
		user_id = ''
	} = event
	if (!user_id) {
		return {
			code: 201,
			msg: '获取用户信息失败'
		}
	}
	const userinfo = await db.collection('user').doc(user_id).get()
	//返回数据给客户端
	return {
		code: 200,
		msg: 'get_user 获取用户数据成功',
		data: userinfo.data[0]
	}
};


// {
// 	"code": 200,
// 	"data": {
// 		"_id": "5fc733ca974b690001e444c9",
// 		"article_ids": ["302042", "301911"],
// 		"article_likes_ids": [],
// 		"author_likes_ids": ["5fc733ca974b690001e444ca"],
// 		"author_name": "Java架构师讲师团",
// 		"avatar": "//img2.sycdn.imooc.com/5dafce1a00013fd501400140-160-160.jpg",
// 		"explain": "架构师成长沟通群878622640，欢迎加入~",
// 		"fans_count": 0,
// 		"follow_count": 0,
// 		"gender": "男",
// 		"id": "8010388",
// 		"integral_count": "",
// 		"label_ids": ["5fc733c8e2c1ee00012d9ed5", "5fc733c8e2c1ee00012d9ed6"],
// 		"professional": "架构师",
// 		"status": "normal",
// 		"thumbs_up_article_ids": ["5fc733c7fb0f8500017999ad", "5fc733c7fb0f8500017999ae", "5fc733c7fb0f8500017999af",
// 			"5fc733c7fb0f8500017999b0", "5fc733c7fb0f8500017999b1", "5fc733c7fb0f8500017999b4", "5fc733c7fb0f8500017999b2",
// 			"5fc733c7fb0f8500017999b6"
// 		]
// 	},
// 	"msg": "get_user 获取用户数据成功"
// }
