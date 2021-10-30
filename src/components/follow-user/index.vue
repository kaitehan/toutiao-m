<template>
  <div class="follow-container">
    <van-button
      v-if="isFollowed"
      class="follow-btn"
      round
      size="small"
      :loading="followLoading"
      @click="changeFollowStatus"
    >已关注</van-button>
    <van-button
      v-else
      class="follow-btn"
      type="info"
      color="#3296fa"
      round
      size="small"
      icon="plus"
      :loading="followLoading"
      @click="changeFollowStatus"
    >关注</van-button>

  </div>
</template>

<script>
import { followUser, cancleFollowUser } from '@/api/user'
export default {
  name: 'FollowUser',
  model: {
    prop: 'isFollowed',
    event: 'changeFollowStatus'
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    autId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      followLoading: false
    }
  },
  methods: {
    async changeFollowStatus () {
      this.followLoading = true
      try {
        if (this.isFollowed) {
          // 取消关注
          await cancleFollowUser(this.autId)
        } else {
          // 关注
          await followUser(this.autId)
        }
        // 更新视图状态  用this.$emit 修改父组件数据
        // this.$emit('followStatusChange', !this.isFollowed)
        // v-model
        this.$emit('changeFollowStatus', !this.isFollowed)
      } catch (err) {
        // 不能关注自己
        let message = '状态更新失败，请稍后重试'
        if (err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      // 关闭loading状态
      this.followLoading = false
    }

  }

}
</script>

<style lang="less" scoped>
.follow-btn {
        width: 170px;
        height: 58px;
      }
</style>
