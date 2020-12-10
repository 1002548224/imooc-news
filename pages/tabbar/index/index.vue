<template>
	<view class="home">
		<!-- 自定义导航栏 -->
		<navbar :isSearch="false"></navbar>
		<!-- 标签 -->
		<tab :list="tabList" @tab="tab" :tabIndex="tableIndex"></tab>
		<!-- 列表 -->
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
			uni.$on('labelChange',(res)=>{
				this.tabList = []
				this.tableIndex = 0
				this.activeIndex = 0
				this.getLabel()
			})
			this.getLabel()
		},
		methods: {
			getLabel() {
				console.log(this.$api)
				this.$api.get_label().then((res) => {
					const {data} = res
					console.log('标签', data)
					data.unshift({
						name:'全部'
					})
					this.tabList = data
				})
			},
			tab({data, index}){
				console.log(data, index)
				this.activeIndex = index
			},
			change(current) {
				this.tableIndex = current
				this.activeIndex = current
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
