<template>

	<swiper class="home-swiper" @change="change" :current="activeIndex">
		<swiper-item class="swiper-item" v-for="(item, index) in tab" :key="index">
			<listItem :list="listCatchData[index]"></listItem>
		</swiper-item>
	</swiper>

</template>

<script>
	import listItem from './list-item.vue'
	export default {
		components: {
			listItem
		},
		props: {
			tab: {
				type: Array,
				defualt() {
					return []
				}
			},
			activeIndex: {
				type: Number,
				default: 0
			}
			
		},
		data() {
			return {
				list1: [],
				// js的限制 listCatchData[index] = data
				listCatchData: {}
			};
		},
		watch:{
			tab(newVal){
				if(newVal.length === 0) return
				this.getList(this.activeIndex)
			}
		},
		// onLoad 在页面， created 组件
		created() {
			// tab还没有赋值
			// this.getList(0)
		},
		methods: {
			change(e) {
				const {
					current
				} = e.detail
				// console.log(current)
				console.log(this.tab[current].name)
				this.getList(current)
				this.$emit('change', current)
			},
			getList(current) {
				console.log(this.tab)
				this.$api.get_list({name:this.tab[current].name}).then(res => {
					console.log(res)
					const {data} = res
					console.log('请求数据:', data)
					// this.list1 = data
					// this.listCatchData[current] = data
					this.$set(this.listCatchData, current, data)
				})
			}
		}
	}
</script>

<style lang="scss">
	.home-swiper {
		height: 100%;

		.swiper-item {
			height: 100%;
			overflow: hidden;

			.list-scroll {
				height: 100%;
			}
		}
	}
</style>
