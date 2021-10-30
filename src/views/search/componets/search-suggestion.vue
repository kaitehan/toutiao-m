<template>
  <div class="search-suggestion">
    <van-cell v-for="(item,index) in suggestionList" :key="index" icon="search" @click="$emit('search',item)">
      <div slot="title" v-html="highLight(item)"></div>
    </van-cell>

  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
// 按需加载有好处，只会将使用到的成员打包到结果中
import { debounce } from 'loadsh'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchedText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestionList: []
    }
  },
  computed: {},
  watch: {
    searchedText: {
      //  当 searchText 发生改变的时候就会调用 handler 函数
      // 注意： handler 函数名称是固定的
      // handler (val) {
      //   this.loadSearchSuggestion(val)
      // },
      // debounce 函数
      // 参数1：一个函数
      // 参数2：延迟时间，单位是毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function (val) {
        console.log(val)
        this.loadSearchSuggestion(val)
      }, 200),
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  created () {},
  methods: {
    async loadSearchSuggestion (val) {
      try {
        const { data: res } = await getSearchSuggestion(val)
        console.log(res)
        this.suggestionList = res.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highLight (text) {
      if (text) {
        const hightLightStr = `<span class="active">${this.searchedText}</span>`

        // 正则表达式  //中间的内容都会当做匹配字符串来使用，而不是数据变量
        // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
        // RegExp  正则表达式构造函数
        //         参数1：匹配字符串，它会根据这个字符串创建正则对象
        //         参数2：匹配模式，要写到字符串中
        const reg = new RegExp(this.searchedText, 'gi')
        return text.replace(reg, hightLightStr)
      }
    }
  }

}
</script>

<style lang="less" scoped>
.search-suggestion{
  /deep/ span.active {
    color: tomato ;
  }
}

</style>
