<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form class="search-form" action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        shape="round"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="onFocus"
      />
    </form>
    <!-- /顶部搜索栏 -->

    <!-- 搜索结果 -->
    <search-result
     v-if="isResultShow"
    :search-text="searchText"></search-result>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
     v-else-if="searchText.trim()"
     :searchedText="searchText"
     @search="onSearch">
     </search-suggestion>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history
    v-else
    :search-histories="searchHistories"
    :onChildrenSearch="onSearch"
    @clearHistory="searchHistories = []"
    ></search-history>
    <!-- /搜索历史记录 -->

  </div>
</template>

<script>
import SearchHistory from '@/views/search/componets/search-history'
import SearchSuggestion from '@/views/search/componets/search-suggestion'
import SearchResult from '@/views/search/componets/search-result'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'SearchPage',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      // 数据持久化
      searchHistories: getItem('serach-histories') || []
    }
  },
  computed: {},
  watch: {
    // 数据持久化
    searchHistories (val) {
      setItem('serach-histories', val)
    }
  },
  created () {},
  methods: {
    onSearch (val) {
      // 更新文本框内容
      this.searchText = val

      // 存储搜索历史记录
      // 要求：不要有重复历史记录，最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    },
    onFocus () {
      this.isResultShow = false
    }
  }

}
</script>

<style lang="less" scoped>
.search-container{
  padding-top: 108px;
  .van-search__action{
    color: #fff;
  }
  .search-form{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}

</style>
