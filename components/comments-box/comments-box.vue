<template>
	<view class="comments-box">
		<view class="comments-header">
			<view class="comments-header__logo">
				<image :src="comments.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="comments-header__info">
				<view class="title" v-if="!comments.is_reply">
					{{comments.author.author_name}}
				</view>
				<view class="title" v-else-if="comments.is_reply">
					{{comments.author.author_name}} <text class="reply-text">回复</text> {{comments.to}}
				</view>
				<view class="">
					<!-- comments.create_time是formatTime的第一个参数 -->
					{{comments.create_time | formatTime}}
				</view>
			</view>
		</view>
		<view class="comments-content">
			<view class="">
				{{comments.comment_content}}
			</view>
			<view class="comments-info">
				<view class="comments-button" @click="commentsReply({comments:comments, is_reply:reply})">
					回复
				</view>
			</view>
			<view class="comments-reply" v-for="item in comments.replys" :key="item.comment_id">
				<!-- 判断当前组件是否为回复 -->
				<commentsBox :reply="true" :comments="item" @reply="commentsReply"></commentsBox>
			</view>
		</view>
	</view>
</template>

<script>
	// 递归引用组件 “自己引用自己”
	import commentsBox from '@/components/comments-box/comments-box.vue'
	import {parseTime} from '@/utils/index.js'
	export default {
		name: "commentsBox", //自己引用自己，需要用name
		props: {
			comments: {
				type: Object,
				default () {
					return {}
				} 
			},
			reply: {
				type: Boolean,
				default: false
			}
		},
		filters:{
			formatTime(time){
				return parseTime(time)
			}
		},
		data() {
			return {

			};
		},
		methods: {
			commentsReply(comment) {
				
				// 为了区分是主回复还是子回复
				if(comment.is_reply){
				// 	// 如果is_reply为true，则该条评论为回复
					comment.comments.reply_id = comment.comments.comment_id
					comment.comments.comment_id = this.comments.comment_id
					// console.log(this.comments)  //主回复
					// console.log(comment)       //子回复 当前回复框的comment
					}
				this.$emit('reply', comment)
				
			}
			
		},
		components: {
			commentsBox
		}
	}
</script>

<style lang="scss">
	.comments-box {
		margin: 15px 0;


		.comments-header {
			display: flex;

			.comments-header__logo {
				flex-shrink: 0;
				width: 30px;
				height: 30px;
				border-radius: 5px;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.comments-header__info {
				display: flex;
				flex-direction: column;
				padding-left: 15px;
				font-size: 12px;
				color: #999;
				line-height: 1;

				.title {
					margin-bottom: 10px;
					font-size: 14px;
					color: #333;
					.reply-text {
						margin: 0 10px;
						font-weight: bold;
						color: #000;
					}
				}
			}
		}

		.comments-content {
			margin-top: 10px;
			font-size: 14px;
			color: #000;

			.comments-info {
				margin-top: 15px;
				display: flex;

				.comments-button {
					padding: 2px 10px;
					font-size: 12px;
					color: #999;
					border-radius: 20px;
					border: 1px #ccc solid;
				}
			}

			.comments-reply {
				display: flex;
				margin: 10px 0;
				padding: 0 10px;
				border: 1px #eee solid;
			}
		}
	}
</style>
