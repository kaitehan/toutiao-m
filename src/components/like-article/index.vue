<template>
  <van-button
        :class="{
          liked:value===1
        }"
        :icon="value===1 ? 'good-job' : 'good-job-o'"
        @click="changeLikeStatus"
        :loading="likeLoading"
      />
</template>

<script>
import { likeArticle, unlikeArticle } from '@/api/user'
export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Number,
      required: true
    },
    artId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      likeLoading: false
    }
  },
  methods: {
    async changeLikeStatus () {
      this.likeLoading = true
      try {
        let status = -1
        if (this.value === 1) {
          await unlikeArticle(this.artId)
          status = 0
        } else {
          await likeArticle(this.artId)
          status = 1
        }
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败，请稍后重试')
      }
      this.likeLoading = false
    }
  }

}
</script>

<style lang="less" scoped>

.liked{
  color:  #ffa500;
}
</style>
