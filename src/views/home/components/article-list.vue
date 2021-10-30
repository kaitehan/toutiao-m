<template>
  <div class="article-list">
    <!-- List 组件通过 loading 和 finished 两个变量控制加载状态，
    当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。
    此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。
    若数据已全部加载完毕，则直接将 finished 设置成 true 即可。 -->

    <!-- 列表组件 -->
    <van-pull-refresh v-model="isreFreshLoading" @refresh="onRefresh"  :success-text="refreshSuccessText" success-duration="1000">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <article-item v-for="(item,index) in list" :key="index" :article="item"></article-item>
      <!-- <van-cell v-for="(item,index) in list" :key="index" :title="item.title" /> -->
    </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束  的状态
      isreFreshLoading: false, // 控制列表下拉刷新的 loading 状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  created () {},
  methods: {
    // 初始化或者滚动到底部的时候会触发调用 onload
    async onLoad () {
      try {
      // 1.请求获取数据
        const { data: res } = await getArticles({
          channel_id: this.channel.id, // 频道id
          // timestamp简单理解就是请求数据的页码
          // 请求第1页数据：当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回
          timestamp: this.timestamp || Date.now()
        })
        // 2.把请求结果数据放到 list 数组中
        const { results } = res.data
        this.list.push(...results)

        // 3.本次数据加载结束之后要把加载状态设置为结束
        this.loading = false

        // 4.判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据 的时间戳
          this.timestamp = res.data.pre_timestamp
        } else {
          // 没有数据了，将 finished 设置为 true ,不在 load 加载更多
          this.finished = true
        }

      // 5.如果没有数据了，把finished 设置为 true,之后不再触发加载更多
      } catch (err) {
        // 展示错误提示状态
        this.error = true

        // 请求失败了，loading也需要关闭
        this.loading = false
      }

      // 1.请求获取数据
      // 异步更新数据
      // // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      //   // 2.把请求结果数据放到 list 数组中
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }

      //   // 3.本次数据加载结束之后要把加载状态设置为结束
      //   //   loading关闭之后才能触发下一次的加载更多
      //   this.loading = false

      //   // 判断数据是否全部加载完成
      //   if (this.list.length >= 40) {
      //     // 如果没有数据了，把finished 设置为 true,之后不再触发加载更多
      //     this.finished = true
      //   }
      // }, 1000)
    },
    // 当下拉刷新的时候会触发调用该函数
    async onRefresh () {
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          // timestamp简单理解就是请求数据的页码
          // 请求第1页数据：当前最新时间戳
          timestamp: Date.now() // 下拉刷新，每次请求获取最新数据，所以传递当前最新时间戳
        })
        // 2.将数据放到列表的顶部
        this.list.unshift(...data.data.results)
        // 3.关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false

        // 更新下拉刷新成功的提示文本
        this.refreshSuccessText = `刷新成功，更新了${data.data.results.length}`
      } catch (err) {
        this.refreshSuccessText = '刷新失败'
        this.isreFreshLoading = false
      }
    }
  }

}
</script>

<style lang="less" scoped>
.article-list{
  height: 79vh;
  overflow-y: auto;

}
</style>
