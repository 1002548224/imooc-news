<template>
	<view class="tab">
		<scroll-view scroll-x="true" class="tab-scroll">
			<view class="tab-scroll_box">
				
				<view class="tab-scroll_item" :class="{active:activeIndex===index}" v-for="(item, index) in list" :key="index"
				 @click="clickTab(item, index)">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<view class="tab-icons" @click="open">
			<uni-icons type="gear" size="26" color="#666"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			},
			tabIndex: {
				type: Number,
				default: 0
			}
		},
		// 可以监听data和props值得变化
		watch: {
			tabIndex(newVal, oldVal) {
				// console.log(newVal, oldVal)
				this.activeIndex = newVal
			}
		},
		data() {
			return {
				activeIndex: 0
			};
		},
		methods: {
			clickTab(item, index) {
				this.activeIndex = index
				// console.log(item, index)
				this.$emit('tab', {
					data: item,
					index: index
				})
			},
			open() {
				uni.navigateTo({
					url:"/pages/home-label/home-label"
				})
			}
		}
	}
</script>

<style lang="scss">
	.tab {
		display: flex;
		// flex: 1;
		width: 100%;
		background-color: #fff;
		border-bottom: 1px #f5f5f5 solid;
		box-sizing: border-box;

		.tab-scroll {
			flex: 1; //flextable充满整个元素
			overflow: hidden; //溢出隐藏
			box-sizing: border-box;

			// border: 1px red solid;
			.tab-scroll_box {
				display: flex;
				align-items: center;
				flex-wrap: nowrap; //不换行
				height: 45px;
				box-sizing: border-box;

				.tab-scroll_item {
					flex-shrink: 0; //不让元素进行挤压
					padding: 0 10px;
					color: #333;
					font-size: 14px;

					&.active {
						color: $mk-base-color;
					}
				}
			}
		}

		.tab-icons {
			position: relative;
			display: flex;
			justify-content: center; //水平方向居中
			align-items: center; // 垂直方向居中
			width: 45px;

			&::after {
				content: '';
				position: absolute;
				top: 12px;
				bottom: 12px;
				left: 0;
				width: 1px;
				background-color: #ddd;

			}
		}
	}
</style>
