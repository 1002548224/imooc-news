// vuex 状态管理
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	// 数据源
	state: {
		// uni.setStorageSync(KEY,DATA)  
		// 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
		historyLists: uni.getStorageSync("__history") || []
	},
	// 改变数据源里的数据
	mutations: {
		SET_HISTORY_LISTS(state, history) {
			state.historyLists = history
		},
		CLEAR_HISTORY(state){
			state.historyLists = []
		}
	},
	// 异步操作
	actions: {
		set_history({commit, state}, history) {
			let list = state.historyLists
			list.unshift(history)
			uni.setStorageSync('__history',list)
			commit('SET_HISTORY_LISTS', list)
		},
		clearHistory({commit}){
			// 清理本地缓存
			// uni.setStorageSync('__history',[])
			uni.removeStorageSync('__history')
			commit('CLEAR_HISTORY')
		}
	}
})

export default store
