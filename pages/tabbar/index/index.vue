<template>
	<view class="home">
		<!-- 自定义导航栏 -->
		<navbar></navbar>
		<tab :list="tabList" @tab="tab" :tabIndex="tableIndex"></tab>
		<view class="home-list">
			<list :tab="tabList" @change="change" :activeIndex = "activeIndex"></list>
		</view>
	</view>
</template>

<script>
	// easyCom components/组件名/组件名.vue  局部引入
	// import navbar from '@/components/navbar/navbar.vue'
	export default {
		data() {
			return {
				title: 'Hello',
				tabList: [],
				tableIndex: 0,
				activeIndex: 0
			}
		},
		onLoad() {
			this.getLabel()
		},
		methods: {
			getLabel() {
				console.log(this.$api)
				this.$api.get_label({
					name: 'get_label'
				}).then((res) => {
					const {data} = res
					this.tabList = data
				})
			},
			tab({data, index}){
				console.log(data, index)
				this.activeIndex = index
			},
			change(current) {
				this.tableIndex = current
				// console.log(current)
			}
		}
		// comments: {
		// 	navbar
		// }
	}
</script>

<style lang="scss">
	page{
		height: 100%;
		display: flex;
	}
	.home {
		display: flex;
		flex-direction: column;
		flex: 1;
		// border: 1px blue solid;
		overflow: hidden;
		.home-list{
			flex: 1;
			box-sizing: border-box;
			// border: 1px red solid;
		}
	}
	
</style>
