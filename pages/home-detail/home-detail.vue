<template>
	<view class="detail">
		<view class="detail-title">
			{{formData.title}}
		</view>
		<view class="detail-header">
			<view class="detail-header__logo">
				<image :src="formData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header__content">
				<view class="detail-header__content-title">
					{{formData.author.author_name}}
				</view>
				<view class="detail-header__content-info">
					<text>{{formData.create_time}}</text>
					<text>{{formData.browse_count}} 浏览</text>
					<text>{{formData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button type="default" class="detail-header__button" @click="follow(formData.author.id)">{{formData.is_author_like?'取消关注':'关注'}}</button>
		</view>
		<view class="detail-content">
			<view class="detail-html">
				<!-- <uParse :content="formData.content" :noData="noData"></uParse> -->
				内容
			</view>
			<view class="detail-comment">
				<view class="comment-title">
					最新评论
				</view>
				<view class="comment-content" v-for="(item, index) in commentsList" :key="index">
					<comments-box :comments="item" @reply="reply"></comments-box>
				</view>
			</view>
		</view>
		<view class="detail-bottom">
			<view class="detail-bottom__input" @click="openComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom__icons">
				<view class="detail-bottom__icons-box">
					<uni-icons type="chat" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box">
					<uni-icons type="heart" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box">
					<uni-icons type="hand-thumbsup" size="22" color="#f07373"></uni-icons>
				</view>
			</view>
		</view>
		<!-- maskClick: 蒙版点击是否关闭弹窗 -->
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="popup-wrap">
				<view class="popup-header">
					<text class="popup-header__item" @click="close">取消</text>
					<text class="popup-header__item" @click="submit">发布</text>
				</view>
				<view class="popup-content">
					<!-- 如果 textarea 是在一个 position:fixed 的区域，需要显示指定属性 fixed 为 true  -->
					<textarea class="popup-content__textarea" v-model="commentsValue" maxlength="200" fixed placeholder="请输入评论内容" />
					<view class="popup-content__count">
						{{commentsValue.length}}/200
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	export default {
		data() {
			return {
				formData: {},
				noData: '<p style="text-align:center; color:#666">详情加载中...<p>',
				// 评论输入框的值
				commentsValue: '',
				commentsList: [],
				replyFormData: {}
			}
		},
		
		onLoad(query) {
			
			this.formData = JSON.parse(query.params1)
			console.log("home-detail里的formData值:", this.formData)
			this.getDetail()
			this.getComments()
		},
		onReady() {
			
		},
		methods: {
			// 获取详情信息
			getDetail() {
				this.$api.get_detail({
					article_id: this.formData._id
				}).then((res) => {
					const {
						data
					} = res
					this.formData = data
					console.log(res)
				})
			},
			setUpdateComment(content) {
				const formdata = {
					article_id: this.formData._id,
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
					this.getComments()
					this.replyFormData = {}
					this.close()
					this.commentsValue = ''
				})
			},
			//  请求评论内容
			getComments() {
				this.$api.get_comments({
					article_id: this.formData._id
				}).then(res => {
					console.log(res)
					const {data} = res
					this.commentsList = data
				})
			},
			// 打开评论发布窗口
			openComment() {
				this.$refs.popup.open()
			},
			// 取消评论窗口
			close() {
				this.$refs.popup.close()
			},
			// 发布
			submit() {
				console.log('发布')
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
				
			},
			reply(e) {
				this.replyFormData = {
					"comment_id": e.comments.comment_id,
					"is_reply": e.is_reply
				}
				if(e.comments.reply_id){
					this.replyFormData.reply_id = e.comments.reply_id
				}
				console.log(this.replyFormData)
				console.log(e)
				this.openComment()
			},
			// 关注
			follow(author_id) {
				console.log("关注", this.formData)
				this.setUpdateAuthor(author_id)
			},
			setUpdateAuthor(author_id){
				uni.showLoading()
				this.$api.update_author({
					author_id
				}).then(res => {
					uni.hideLoading()
					console.log(res)
					this.formData.is_author_like = !this.formData.is_author_like
					uni.showToast({
						title:this.formData.is_author_like?'关注作者成功':'取消关注作者',
						icon:'none'
					})
				})
			}
		},
		components:{
			uParse
		}
	}
</script>

<style lang="scss">
	.detail {
		padding: 15px 0;
		padding-bottom: 54px;
	}

	.detail-title {
		padding: 0 15px;
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}

	.detail-header {
		display: flex;
		align-items: center;
		margin-top: 10px;
		padding: 0 15px;

		.detail-header__logo {
			flex-shrink: 0; // 压缩  ：0 不压缩
			width: 40px;
			height: 40px;
			border-radius: 50%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.detail-header__content {
			width: 100%;
			padding-left: 10px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			font-size: 12px;

			.detail-header__content-title {
				font-size: 14px;
				color: #333;
			}

			.detail-header__content-info {
				color: #999;

				text {
					margin-right: 10px;
				}
			}
		}
		.detail-header__button {
			flex-shrink: 0;
			height: 30px;
			font-size: 12px;
			color: #fff;
			background-color: $mk-base-color;
		}
	}

	.detail-content {
		margin-top: 20px;
		min-height: 500px;
		// border: 1px red solid;

		.detail-html {
			padding: 0 15px;
		}
		.detail-comment {
			margin-top: 30px;
			.comment-title {
				padding: 10px 15px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #f5f5f5 solid;
			}
			.comment-content {
				padding: 0 15px;
				border-top: 1px #eee solid;
			}
		}
	}

	.detail-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		width: 100%;
		height: 44px;
		border-top: 1px #f5f5f5 solid;
		background-color: #fff;
		box-sizing: border-box;

		.detail-bottom__input {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 10px;
			padding: 0 10px;
			width: 100%;
			height: 30px;
			border: 1px #ddd solid;
			border-radius: 5px;

			text {
				font-size: 14px;
				color: #999;
			}
		}

		.detail-bottom__icons {
			display: flex;
			flex-shrink: 0;
			padding: 0 10px;

			.detail-bottom__icons-box {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 44px;
			}
		}
	}
	.popup-wrap {
		background-color: #fff;
		.popup-header {
			display: flex;
			justify-content: space-between;
			font-size: 14xp;
			color: #666;
			border-bottom: 1px #f5f5f5 solid;
			.popup-header__item {
				height: 50px;
				line-height: 50px;
				padding: 0 15px;
			}
		}
		.popup-content {
			width: 100%;
			padding: 15px;
			box-sizing: border-box;
			.popup-content__textarea {
				width: 100%;
				height: 200px;
			}
			.popup-content__count {
				display: flex;
				justify-content: flex-end;
				font-size: 12px;
				color: #999;
			}
		}
	}
</style>
