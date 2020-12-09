<template>
	<view class="home">
		<navbar :isSearch="true" @input="change" v-model="value"></navbar>
		<view class="home-list">
			<view v-if="is_histroy" class="label-box">
				<view class="label-header">
					<text class="label-title">搜索历史</text>
					<text class="label-clear" @click="clear">清空</text>
				</view>
				<view v-if="historyLists.length > 0" class="label-content">
					<view class="label-content_item" v-for="(item, index) in historyLists" :key="index" @click="openHistory(item)">{{item.name}}

					</view>
				</view>
				<view v-else class="no-data">
					没有搜索历史
				</view>
			</view>
			<list-scroll v-else>
				<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
				<view v-if="searchList.length > 0">
					<list-card :item="item" v-for="(item, index) in searchList" :key="index" @click="setHistory(item)"></list-card>
				</view>
				<view class="no-data" v-if="searchList.length === 0 && !loading">
					没有搜索到相关数据
				</view>
			</list-scroll>
		</view>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				loading: false,
				value: '',
				is_histroy: true,
				searchList: []
			}
		},
		onLoad() {
			// this.getSearch()
		},
		computed: {
			...mapState(['historyLists'])
		},
		methods: {
			clear() {
				this.$store.dispatch('clearHistory')
				uni.showToast({
					title: '清空完成'
				})
			},
			change(value) {
				// this.getList(value)
				// console.log('接收的value：', value)
				// 做标记
				if (!value) {
					clearTimeout(this.timer)
					this.mark = false
					this.getSearch(value)
					return
				}
				if (!this.mark) {
					console.log(value)
					this.mark = true
					this.timer = setTimeout(() => {
						this.mark = false
						this.getSearch(value)
					}, 1000)

				}
			},
			getSearch(value) {
				if (!value) {
					this.searchList = []
					this.is_histroy = true
					return
				}
				this.is_histroy = false
				this.loading = true
				this.$api.get_search({
					value
				}).then(res => {
					const {
						data
					} = res
					console.log(res)
					this.searchList = data
					this.loading = false
				}).catch(() => {
					this.loading = true
				})
			},
			setHistory() {
				this.$store.dispatch('set_history', {
					name: this.value
				})
			},
			openHistory(item) {
				this.value = item.name
				console.log(item.name)
				this.getSearch(this.value)
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
		background-color: #f5f5f5;
	}

	.home {
		display: flex;
		flex-direction: column;
		flex: 1; //自适应布局，自动放大占满剩余格子
		// flex: n（n>0）
		// = flex-grow: n;(放大) flex-shrink: 1;（缩小） flex-basis:0%

		.label-box {
			background-color: #fff;
			margin-bottom: 10px;

			.label-header {
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color: #666;
				padding: 10px 15px;
				border-bottom: 1px #f5f5f5 solid;

				.label-title {
					color: $mk-base-color;
				}

				.label-clear {
					color: #30b33a;
					font-weight: bold;
				}
			}

			.label-content {
				display: flex;
				flex-wrap: wrap; //让弹性盒元素在必要的时候拆行：
				padding: 15px;
				padding-top: 0;

				.label-content_item {
					padding: 2px 10px;
					margin-top: 12px;
					margin-right: 10px;
					border-radius: 5px;
					border: 1px #666 solid;
					font-size: 14px;
					color: #666;
				}
			}
		}
	}

	.no-data {
		height: 200px;
		line-height: 200px;
		width: 100%;
		text-align: center;
		color: #666;
		font-size: 12px;
	}
</style>
