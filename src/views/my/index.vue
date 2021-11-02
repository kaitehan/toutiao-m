<template>

  <div class="my-container">
    <!-- 头部区域 -->
    <!-- 已登录 -->
    <div class="header user-info" v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="userInfo.photo"
          />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button round size="mini" to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <div class="base-status">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>

      </div>

    </div>

    <!-- 未登录 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="">
        <span class="text">登录/注册</span>
      </div>
    </div>

    <!-- 导航 -->
    <van-grid class="grid-nav mb-9" :column-num="2" clickable>
      <van-grid-item class="gird-item" text="文字" >
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="gird-item" text="文字" >
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <van-cell title="消息通知" is-link url="/vant/mobile.html" />
    <van-cell title="小智同学" class="mb-9" is-link to="index" />
    <van-cell title="退出登录" class="logout-cell" v-if="user" clickable @click="onlogout"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data () {
    return {
      userInfo: {}// 用户信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    // 如果用户登录了，则请求加载用户信息
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted () {},
  methods: {
    onlogout () {
      console.log('logout')
      // 退出提醒
      // 在组件中需要使用 this.$dialog 来调用弹框组件
      this.$dialog.confirm({
        message: '是否确认退出？'
      })
        .then(() => {
          // on confirm
          // 确认退出，清除登录状态（容器中的 user + 本地存储中的 user）
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          console.log('取消退出')
        })
    },
    // 获取用户数据
    async loadUserInfo () {
      try {
        const { data: res } = await getUserInfo()
        this.userInfo = res.data
        // console.log(res)
      } catch (err) {
        this.$toast('获取用户信息失败，请稍后再试！')
      }
    }
  }

}
</script>

<style lang="less" scoped>
.my-container{
  .header{
    height: 361px;
    background: url('../../assets/banner.png');
    background-size: cover;
  }

  .not-login{
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img{
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text{
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info{
    .base-info{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      .left{
        display: flex;
        justify-content: center;
        align-items: center;
        .avatar{
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .name{
          font-size: 30px;
          color: #fff;
        }
      }
      .right{
        .van-button--default{
          border: none;
          background-color: lightblue;
          color: #fff;

        }

      }
    }
    .base-status{
      display: flex;
      height: 130px;
      color: #fff;
      .data-item{
        display: flex;
        flex:1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 130px;
        .count{
          font-size: 36px;
        }
        .text{
          font-size: 23px;
        }
      }

    }
  }

  .grid-nav{
    .gird-item{
      height: 141px;
      i.toutiao{
        font-size: 45px;
      }
      .toutiao-shoucang{
        color: #eb5253;
      }
      .toutiao-lishi{
        color: #ff9d1d;
      }
      span.text{
        font-size: 28px;
      }
    }
  }
  .mb-9{
    margin-bottom: 9px;
  }
  .logout-cell{
    color: #eb5253;
    text-align: center;
  }
}
</style>
