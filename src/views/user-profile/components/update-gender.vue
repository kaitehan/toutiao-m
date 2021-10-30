<template>
  <div class="update-gender">

    <!-- 选择框 -->
    <div>
      <van-picker
        title="修改性别"
        show-toolbar
        :columns="columns"
        :default-index="value.gender"
        @confirm="onConfirm"
        @cancel="$emit('close')"
      />
    </div>

    <!-- /选择框 -->
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女']
    }
  },
  methods: {
    async onConfirm (value, index) {
      this.$toast.loading({
        message: '更新中...',
        forbidClick: true,
        duration: 0
      })
      try {
        await updateUserProfile({
          name: this.value.name,
          gender: index,
          birthday: this.value.birthday,
          real_name: this.value.name,
          intro: ''
        })
        this.value.gender = index
        this.$emit('input', this.value)
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新数据失败')
      }
    }
  }

}
</script>
<style lang="less" scoped>

</style>
