<template>
  <van-list
    v-model="loading"
    :finished="finished"
    :error.sync="error"
    error-text="加载失败，请稍后重试"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <!-- <van-cell v-for="(item,index) in list" :key="index" :title="item.content" /> -->
    <comment-item  @click-reply="onReplyShow"  v-for="(item,index) in list" :key="index" :comment="item">
    </comment-item>
    <!-- 评论回复 -->
      <van-popup
        v-model="isReplyShow"
        position="bottom"
        style="height: 75%"
      >
        <comment-reply @click-close="isReplyShow=false" :art-id="source" :comment="currentComment" ></comment-reply>
      </van-popup>
      <!-- /评论回复 -->

  </van-list>
</template>
<script>
import { getComment } from '@/api/comment'
import CommentItem from '@/views/article/components/comment-item'
import CommentReply from '@/views/article/components/comment-reply'
export default {
  name: 'CommentList',
  components: {
    CommentItem,
    CommentReply
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一次数据的标记
      limit: 10,
      error: false,
      isReplyShow: false,
      currentComment: {}
    }
  },
  created () {
    this.onLoad()
  },
  methods: {
    async onLoad () {
      try {
        // 1.请求获取数据
        const { data: res } = await getComment({
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // console.log(res)
        // 2.将数据添加到列表中
        const { results } = res.data

        // 把文章的评论的总数量传到外部
        this.$emit('onload-success', res.data)

        this.list.push(...results)

        // 3.将 loading 设置为 false
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          //  有就更新获取下一页数据页码
          this.offset = res.data.last_id
        } else {
          //  没有就将  finished 设置为true
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },
    onReplyShow (comment) {
      // 将子组件中传给我评论对象存储到当前组件
      this.currentComment = comment
      // 展示弹出框
      this.isReplyShow = true
    }
  }

}
</script>
<style lang="less" scoped>

</style>
