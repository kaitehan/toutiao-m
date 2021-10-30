<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
    title="修改昵称"
    left-text="取消"
    right-text="完成"
    @click-left="$emit('close')"
    @click-right="onUpdateName"
    >
    </van-nav-bar>
    <!-- 导航栏 -->

    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="localName"
        rows="1"
        autosize
        type="textarea"
        maxlength="8"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>

    <!-- /输入框 -->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      localName: this.value.name
    }
  },
  created () {},
  methods: {
    async onUpdateName () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const localName = this.localName
        if (!localName.length) {
          this.$toast('昵称不能为空')
          return
        }
        await updateUserProfile({
          name: localName,
          gender: this.value.gender,
          birthday: this.value.birthday,
          real_name: localName,
          intro: ''
        })
        this.value.name = localName
        // 更新数据
        this.$emit('input', this.value)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新完成')
      } catch (err) {
        this.$toast.fail('修改信息失败，请稍后重试')
      }
    }
  }

}
</script>
<style lang="less" scoped>
.update-name{
  .field-wrap{
    padding: 20px;
  }
}
</style>
