<template>
<!--
  currentDate 双向绑定了日期选择器
      设置日期选择器的默认值
      同步日期选择器选择的日期
  minDate  可选的最小日期
  maxDate  可选的最大日期
 -->
  <van-datetime-picker
  v-model="currentDate"
  type="date"
  title="选择年月日"
  :min-date="minDate"
  :max-date="maxDate"
  @cancel="$emit('close')"
  @confirm="onConfirm"
/>
</template>
<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  components: {},
  data () {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value.birthday)
    }
  },
  created () {
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '更新中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        await updateUserProfile({
          name: this.value.name,
          gender: this.value.gender,
          birthday: currentDate,
          real_name: this.value.name,
          intro: ''
        })
        this.value.birthday = currentDate
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
