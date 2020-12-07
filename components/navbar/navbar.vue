<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<!-- 状态栏 -->
			<view :style="{height: statusBarHeight + 'px'}"></view>
			<!-- 导航栏内容 -->
			<view class="navbar-content" :style="{height:navBarHeight + 'px', width:windowWidth+'px'}">
				<view class="navbar-search">
					<view class="navbar-search_icon">
						<!-- 搜索图标 -->
						<uni-icons type="search" size="16" color="#999"></uni-icons>
						<!-- <text class="iconfont icon-search"></text> -->
					</view>
					<view class="navbar-search_text">uni-app、vue</view>
				</view>
			</view>
		</view>
		<view :style="{height: statusBarHeight+navBarHeight+'px'}"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 20,
				navBarHeight: 45,
				windowWidth: 375
			}
		},
		created() {
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
						font-size: 12px;
						color: #999;
					}
				}
			}

		}
	}
</style>
