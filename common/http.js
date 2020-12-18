import store from '../store/index.js'
export default function $http(options){
	const {url,data} = options
	const dataObj = {
		user_id: store.state.userinfo._id,
		...data
	}
	
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({
			name: url, //云函数的名称
			data: dataObj
		}).then((res) => {
			if (res.result.code === 200) {
				// .then
				resolve(res.result)
			} else {
				// catch
				reject(res.result)
			}
		}).catch((err) => {
			reject(err)
		})
	})
}