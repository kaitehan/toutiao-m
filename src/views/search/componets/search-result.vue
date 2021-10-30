<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="页面加载失败，请稍后再试"
    >
      <van-cell v-for="(item,index) in list" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    async onLoad () {
      try {
        // 1.请求获取数据
        const { data: res } = await getSearchResult({
          page: this.page,
          per_page: this.per_page,
          q: this.searchText
        })

        // 2.将数据添加到数组列表中
        this.list.push(...res.data.results)
        // 3.将本次加载中 loading 关闭
        this.loading = false
        // 4.判断是否还有数据
        if (res.data.results.length) {
          // 如果有,则更新获取下一个数据页码
          this.page++
        } else {
          // 如果没有，则将加载状态 finished  设置为结束
          this.finished = true
        }
      } catch (err) {
        // 展示加载失败的状态
        this.error = true
        // 加载失败了，loading也要关闭
        this.loading = false
      }
    }
  }

}
</script>

<style lang="less" scoped>

</style>
