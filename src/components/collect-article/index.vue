<template>
  <van-button
        :class="{
          collected:value
        }"
        :icon="value ? 'star' : 'star-o'"
        @click="changeStarStatus"
        :loading="starLoading"
      />
</template>

<script>
import { starArticle, unstarArticle } from '@/api/user'
export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    artId: {
      type: [Number, String, Object],
      required: true
    }

  },
  data () {
    return {
      starLoading: false
    }
  },
  methods: {
    async changeStarStatus () {
      this.starLoading = true
      try {
        if (this.value) {
          await unstarArticle(this.artId)
          this.$toast.success('取消收藏')
        } else {
          await starArticle(this.artId)
          this.$toast.success('收藏成功')
        }
        this.$emit('input', !this.value)
      } catch (err) {
        this.$toast.fail('状态更新失败，请稍后重试！')
      }
      this.starLoading = false
    }
  }

}
</script>

<style lang="less" scoped>

.collected{
  color:  #ffa500;
}

</style>
