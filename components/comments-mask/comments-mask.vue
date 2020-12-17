<template>
	<view>
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="popup-wrap">
				<view class="popup-header">
					<text class="popup-header__item" @click="close">取消</text>
					<text class="popup-header__item" @click="submit">发布</text>
				</view>
				<view class="popup-content">
					<!-- 如果 textarea 是在一个 position:fixed 的区域，需要显示指定属性 fixed 为 true  -->
					<textarea class="popup-content__textarea" maxlength="200" v-model="commentsValue1" fixed placeholder="请输入评论内容" />
					<view class="popup-content__count">
						{{commentsValue1.length}}/200
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		props:{
			commentsValue:{
				type: String,
				default: '125'
			}
		},
		data() {
			return {
				commentsValue1: ''
			};
		},
		methods:{
			submit(){
				this.$emit('submit', this.commentsValue1)
			},
			open(){
				this.$refs.popup.open()
			},
			close(){
				this.$refs.popup.close()
				this.commentsValue1 = ''
			}
		}
	}
</script>

<style lang="scss">
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
