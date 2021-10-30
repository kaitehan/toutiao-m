<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar  title="登录" class="page-nav-bar" >
      <van-icon name="arrow-left" slot="left" @click="$router.back()" />
    </van-nav-bar>

    <!-- 登录表单 -->
    <!--
      表单验证：
        1.给 van-field 组件配置 rules 验证规则
          参考文档：https://vant-contrib.gitee.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
        2.当表单提交的时候会自动触发表单验证
          如果验证通过，会触发 submit 事件
          如果验证失败，不会触发 submit
     -->
    <van-form ref="loginFormRef" @submit="onSubmit">
      <van-field
      v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
         :rules="userFormRules.mobile"
         type='number'
         maxlength="11"
      >
      <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
      v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        maxlength="6"
      >
      <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
      <template #button>
        <!-- time 倒计时时间 -->
        <van-count-down v-if="isCountDownShow" :time="1000 * 60" format="ss s" @finish="isCountDownShow=false"/>
        <van-button v-else round size="small" type="default"  class="send-sms-btn" native-type="button" @click="onSendSms">获取验证码</van-button>
      </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [{ required: true, message: '请填写用户名' }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '请填写验证码'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false

    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit () {
      // 1.获取表单数据
      const user = this.user
      // 2.表单验证

      // 在组件中必须通过 this.$toast 来调用 Toast 组件
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, // 禁用背景点击
        duration: 2000 // 持续时间默认是2s , 如果为0则持续展示
      })
      // 3.提交表单请求登录
      try {
        const { data: res } = await login(user)
        this.$store.commit('setUser', res.data)
        this.$toast.success('登录成功')

        // 登录成功，跳转回原来界面
        // back方式不严谨
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或者验证码错误')
        } else {
          this.$toast.fail('登录失败,请稍后重试')
        }
      }
      // 4.根据请求响应结果处理后续操作
    },
    async onSendSms () {
      // 1.验证手机号
      try {
        await this.$refs.loginFormRef.validate('mobile')
        console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2.验证通过，显示倒计时
      this.isCountDownShow = true

      // 3.请求发生验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        }
        this.$toast('验证码发送失败,请稍后重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao{
    font-size: 37px;
  }

  .send-sms-btn{
    width: 162px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    color: #666;
    background-color: #ededed;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn{
      background-color: #6db4fb;
      border: none;
      border-radius: 10px;
    }
  }
}

</style>
