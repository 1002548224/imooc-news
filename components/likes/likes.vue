<template>
	<view class="icons" @click.stop="liketap">
		<uni-icons :type="like ? 'heart-filled':'heart'" size="20" color="#f07373"></uni-icons>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				like: false
			};
		},
		watch: {
			item(newVal) {
				this.like = this.item.is_like
			}
		},
		created() {
			this.like = this.item.is_like
		},
		methods: {
			liketap() {
				this.like = !this.like
				this.setUpdateLikes()
			},
			setUpdateLikes() {
				// 显示 loading 提示框 
				uni.showLoading()
				console.log(this.item)
				this.$api.update_like({
						user_id: '5fc733ca974b690001e444c9',
						article_id: this.item._id
					})
					.then(res => {
						uni.hideLoading()
						uni.showToast({
							title: this.like ? '收藏成功' : '取消收藏',
							icon: 'none'
						})
						console.log(res)
					}).catch(() => {
						uni.hideLoading()
					})
			}
		}
	}
</script>

<style lang="scss">
	.icons {
		position: absolute;
		right: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 20px;
		height: 20px;
	}
</style>
