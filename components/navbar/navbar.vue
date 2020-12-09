<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<!-- 状态栏 -->
			<view :style="{height: statusBarHeight + 'px'}"></view>
			<!-- 导航栏内容 -->
			<view class="navbar-content" :class="{search: isSearch}" :style="{height:navBarHeight + 'px', width:windowWidth+'px'}" @click.stop="open">
				<!-- 返回箭头 -->
				<view v-if="isSearch" class="navbar-content__search-icons" @click="back">
					<uni-icons type="back" size="22" color="#fff"></uni-icons>
				</view>
				<!-- 搜索框  非搜索页显示-->
				<view  v-if="!isSearch" class="navbar-search">
					<!-- 搜索图标 -->
					<view class="navbar-search_icon">
						<!-- 搜索图标 -->
						<uni-icons type="search" size="16" color="#999"></uni-icons>
						<!-- <text class="iconfont icon-search"></text> -->
					</view>
					<view class="navbar-search_text">uni-app、vue</view>
				</view>
				<!-- 搜索页显示 -->
				<view v-else class="navbar-search">
					<input class="navbar-search_text" type="text" placeholder="请输入需要搜索的内容" v-model="val" @input="inputChange"/>
				</view>
			</view>
		</view>
		<view :style="{height: statusBarHeight+navBarHeight+'px'}"></view>
	</view>
</template>

<script>
	export default {
		props: {
			// 是否在搜索页面
			isSearch: {
				type: Boolean,
				default: true
			},
			value: {
				type: [String, Number],
				default: ''
			}
		},
		data() {
			return {
				statusBarHeight: 20,
				navBarHeight: 45,
				windowWidth: 375,
				val: ''
			}
		},
		watch:{
			value(newVal) {
				this.val = newVal
			}
		},
		created() {
			console.log(this.isSearch)
			// 获取手机系统信息
			const info = uni.getSystemInfoSync()
			console.log(info)
			this.statusBarHeight = info.statusBarHeight
			this.windowWidth = info.windowWidth
			// h5 app mp-alipay不支持
			// #ifndef H5 || APP-PLUS || MP-ALIPAY
			// 获取胶囊的位置
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			console.log(menuButtonInfo)
			// （胶囊底部 - 状态栏的高度）+ （胶囊顶部 - 状态栏的高度） = 导航栏高度
			this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info.statusBarHeight)
			console.log(this.navBarHeight)
			this.windowWidth = menuButtonInfo.left
			// #endif
		},
		methods: {
			open() {
				if(this.isSearch) return
				uni.navigateTo({
					url: "/pages/home-search/home-search"
				})
			},
			inputChange(e) {
				const {value} = e.detail
				// console.log(value)
				this.$emit('input', value)
			},
			back() {
				// uni.navigateBack({
					
				// })
				// switchTab() 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 
				uni.switchTab({
					url:'/pages/tabbar/index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '../../common/css/icon.css';

	.navbar {
		.navbar-fixed {
			// ---------------------------
			// 保证导航栏始终显示在最上方
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			// ---------------------------
			// display: flex;
			// justify-content: center;
			// align-items: center;
			width: 100%;
			// padding: 0 15px;
			width: 100%;
			// height: 45px;
			background-color: $mk-base-color;
			box-sizing: border-box; //在盒内显示

			.navbar-content {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 15px;
				box-sizing: border-box; //在盒内显示

				.navbar-search {
					display: flex;
					align-items: center;
					padding: 0 10px;
					width: 100%;
					height: 30px;
					border-radius: 30px;
					background-color: #fff;

					.navbar-search_icon {
						// width: 10px;
						// height: 10px;
						// border: 1px red solid;
						margin-right: 10px;
					}

					.navbar-search_text {
						width: 100%;
						font-size: 14px;
						color: #999;
					}
				}

				&.search {
					padding-left: 0;

					.navbar-content__search-icons {
						margin-left: 10px;
						margin-right: 10px;
					}
					.navbar-search {
						border-radius: 5px;
					}
				}
			}


		}
	}
</style>
