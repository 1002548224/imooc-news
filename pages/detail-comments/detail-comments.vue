<template>
	<view>
		<view class="comments-content" v-for="(item, index) in commentsList" :key="index">
			<comments-box :comments="item" @reply='reply'></comments-box>
		</view>
		<uni-load-more v-if="commentsList.length === 0 || commentsList.length > 2" iconType="snow" :status="loading"></uni-load-more>
		<comments-mask ref="popup" :commentsValue="commentsValue" @submit="submit"></comments-mask>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				commentsList: [],
				article_id: '',
				page: 1,
				pageSize: 2,
				loading: 'loading',
				replyFormData: {},
				commentsValue: ''
			}
		},
		onLoad(query) {
			this.article_id = query.id
			this.getComments()
		},
		// 页面上拉触底事件的处理函数 
		onReachBottom() {
			if (this.loading === 'noMore') return
			console.log('--------上拉触底')
			this.page++
			this.getComments()
		},
		methods: {
			//请求评论
			getComments() {
				this.$api.get_comments({
					article_id: this.article_id,
					page: this.page,
					pageSize: this.pageSize
				}).then(res => {
					const {
						data
					} = res
					if (data.length === 0) {
						this.loading = 'noMore'
						return
					}
					// 对象复制
					// 先转成字符串，再转成parse
					let oldFormData = JSON.parse(JSON.stringify(this.commentsList))
					console.log(oldFormData)
					oldFormData.push(...data)

					// console.log(res)
					this.commentsList = oldFormData
				})
			},
			reply(e) {
				this.$refs.popup.open()
				this.replyFormData = {
					"comment_id": e.comments.comment_id,
					"is_reply": e.is_reply
				}
				if(e.comments.reply_id){
					this.replyFormData.reply_id = e.comments.reply_id
				}
				console.log(this.replyFormData)
				console.log(e)
			},
			submit(commentsValue1){
				this.commentsValue = commentsValue1
				console.log(this.commentsValue)
				if(!this.commentsValue){
					uni.showToast({
						title:'请输入评论内容',
						icon:"none"
					})
					return
				}
				this.setUpdateComment({
					content: this.commentsValue, ...this.replyFormData
				})
				// this.$route.go(0)
			},
			setUpdateComment(content) {
				const formdata = {
					article_id: this.article_id,
					...content
				}
				// console.log(formdata)
				// formdata:
				// article_id: "5fc733c7fb0f8500017999ad"
				// comment_id: "3gvhkz0lo1g0"
				// content: "test"
				uni.showLoading()
				this.$api.update_comment(formdata).then((res) => {
					console.log(res)
					uni.hideLoading()
					uni.showToast({
						title: '评论发布成功'
					})
					this.replyFormData = {}
					this.$refs.popup.close()
					this.commentsValue = ''
					this.getComments()
					
				})
			}
			
		}
	}
</script>

<style lang="scss">
	.comments-content {
		padding: 0 15px;
	}
</style>
