<template>
  <div class="search-history">
    <van-cell title="搜索历史" >
      <template v-if="isDeleteShow">
        <span @click="$emit('clearHistory')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </template>
      <van-icon v-else name="delete" @click="isDeleteShow = true"/>
    </van-cell>
    <van-cell
     :title="item"
     v-for="(item,index) in searchHistories"
     :key="index"
     @click="onHistoryClick(item, index)"
    >
      <van-icon v-show="isDeleteShow" name="close" slot="right-icon" class="close-icon" />

    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    },
    onChildrenSearch: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    onHistoryClick (item, index) {
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
      } else {
        this.onChildrenSearch(item)
      }
    }
  }

}
</script>

<style lang="less" scoped>
.search-history{
 /deep/ .van-cell{
    .close-icon{
      display: flex;
      align-items: center;
    }
  }
}

</style>
