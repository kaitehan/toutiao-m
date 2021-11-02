<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="黑马头条"
    >
     <van-icon name="arrow-left" slot="left" @click="$router.back()" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate | relaviteTime}}</div>

          <!-- 关注按钮组件 -->
          <!--
            模板中的 $event 是事件参数
            当我们传递给组件的数据既要使用又要修改
              传递： props
              :is-followed="article.is_followed"
              修改 ： 自定义事件
              @followStatusChange="article.is_followed=$event"
            简写方式：在组件上使用 v-model
              value="article.is_followed"
              @input="article.is_followed= $event"

              如果需要修改 v-model 的规则名称，可以通过子组件的  model 属性来配置修改，父组件不动

              一个组件上只能使用一次 v-model
              如果有多个数据需要实现类似于 v-model 的效果，咋办？
              可以使用属性 .sync 修饰符
           -->
          <follow-user v-model="article.is_followed" :aut-id="article.aut_id"></follow-user>

        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div ref="articleContentRef" class="article-content markdown-body" v-html="article.content"></div>
        <van-divider>正文结束</van-divider>
        <!-- /文章内容 -->

        <!-- 评论列表 -->
        <comment-list :list="commentList" @onload-success="totalCommentCount = $event.total_count" :source="article.art_id"></comment-list>
        <!-- /评论列表 -->

         <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow=true"
          >写评论</van-button>
          <van-icon
            name="comment-o"
            :info="totalCommentCount"
            color="#777"
          />

          <collect-article :art-id="article.art_id" v-model="article.is_collected"></collect-article>

          <like-article :art-id="article.art_id" v-model="article.like_count"></like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论 -->
        <van-popup v-model="isPostShow" position="bottom"  >
          <comment-post @closePops="onClosePops" :target='article.art_id'></comment-post>
        </van-popup>
        <!-- /发布评论 -->

      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errorStatus===404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else  class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticleDetails">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from '@/views/article/components/comment-list'
import CommentPost from '@/views/article/components/comment-post'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {},
      loading: true,
      errorStatus: 0,
      followLoading: false,
      totalCommentCount: 0,
      isPostShow: false, // 控制发布评论的显示状态
      commentList: []

    }
  },
  created () {
    this.loadArticleDetails()
  },
  watch: {},
  computed: {},
  mounted () {},
  methods: {
    async loadArticleDetails () {
      this.loading = true
      try {
        const { data: res } = await getArticleById(this.articleId)
        // 手动报错
        // if (Math.random() > 0.5) {
        //   JSON.parse('asdgasdggas')
        // }

        // 数据驱动视图不是立即的
        this.article = res.data

        // 初始化图片预览
        // console.log(this.$refs.articleContentRef)
        setTimeout(() => {
          this.previewImage()
        }, 0)

        // 请求成功，关闭 loading
        // this.loading = false
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errorStatus = 404
        }
        this.$toast('数据获取失败，请重新再试！')
        // this.loading = false
      }
      this.loading = false
    },
    previewImage () {
      // 得到所有的 img 结点
      const articleContent = this.$refs.articleContentRef
      const imgs = articleContent.querySelectorAll('img')
      // console.log(img)
      // 提取所有 img 地址
      const imgURLs = []
      imgs.forEach((img, index) => {
        imgURLs.push(img.src)

        // 给每个 img 注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            // 预览图片地址数组
            images: imgURLs,
            // 从起始位置开始
            startPosition: index
          })
        }
      })
    },
    onClosePops (data) {
      // 关闭弹出层
      this.isPostShow = false
      this.totalCommentCount++
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    }

  }

}
</script>

<style lang="less" scoped>
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
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
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .van-button--normal{
      padding: 0;
    }
    .van-button--default{
      font-size: 33px;
      border: none ;
    }
  }
}
</style>
