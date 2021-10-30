<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('click-close')"
      />
    </van-nav-bar>
    <!-- /导航栏 -->
    <div class="main">
      <!-- 当前评论项 -->
    <comment-item class="current-comment" :is-reply="true" :comment='comment'></comment-item>
    <!-- /当前评论项 -->

    <van-cell   title="全部回复" />

    <!-- 评论的回复列表 -->
    <van-list :error.sync="error" error-text="加载失败，请稍后再试" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
       <comment-item :is-reply="true" v-for="(item,index) in list" :key="index" :comment="item"></comment-item>
    </van-list>
    <!-- /评论的回复列表 -->

    </div>

    <!-- 底部 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        size="small"
        icon="edit"
        @click="isReplyPostShow=true"
      >写评论</van-button>
    </div>
    <!-- /底部 -->
     <!-- 发布评论 -->
      <van-popup v-model="isReplyPostShow" position="bottom"  >
        <comment-post @closePops="onCloseReplyPops" :article-id="artId" :target='comment.com_id'></comment-post>
      </van-popup>
      <!-- /发布评论 -->
  </div>
</template>

<script>
import CommentItem from '@/views/article/components/comment-item'
import CommentPost from '@/views/article/components/comment-post'
import { getComment } from '@/api/comment'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    artId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false,
      finished: false,
      list: [],
      offset: null,
      limit: 20,
      error: false,
      isReplyPostShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      try {
        // 1.获取请求数据
        const { data: res } = await getComment({
          type: 'c',
          source: this.comment.com_id.toString(),
          offset: this.offset,
          limit: this.limit
        })
        // 2.将数据添加到列表中
        const { results } = res.data
        this.list.push(...results)

        // 3.将加载 loading 设置为false
        this.loading = false
        // 4.判断数据是否加载完毕
        if (results.length) {
          //    有数据，继续加载数据
          this.offset = res.data.last_id
        } else {
          //    没有数据将  finised 设置为 true
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },
    onCloseReplyPops (data) {
      this.isReplyPostShow = false

      this.list.unshift(data.new_obj)
    }
  }
}
</script>

<style lang="less" scoped>
.main{
  height: 900px;
  overflow-y: auto;
  .van-cell::after{
    border: none;
  }
  .current-comment{
    border-bottom: 1px solid #ebebeb;
  }
}
.article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 100%;
      height: 100%;
      border: none;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }

  }
</style>
