<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar   class="page-nav-bar" fixed>
      <van-button class="search-btn" round slot="title" type="info" size="small" icon="search" to="/search">搜索</van-button>
    </van-nav-bar>

    <!-- 频道列表 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id">
        <!-- 文章列表 -->
        <article-list :channel='item'></article-list>
        <!-- 文章列表 -->
      </van-tab>
      <div slot="nav-right" class="place-holder">
      </div>
      <div slot="nav-right" class="hunburger-btn" @click="isChennelEditShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup @close="closePopup" v-model="isChennelEditShow" round closeable position="bottom" close-icon-position="top-left" :style="{ height: '90%' }" >
      <channel-edit ref="channelEditRef" :my-channels="channelList" :active="active" @update-active="updateActive"></channel-edit>
    </van-popup>
    <!-- /频道编辑弹出层 -->

  </div>
</template>

<script>
import { getUserChannels } from '@/api/user.js'
import ArticleList from '@/views/home/components/article-list'
import ChannelEdit from '@/views/home/components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      channelList: [], // 频道列表
      isChennelEditShow: false // 控制编辑频道编辑层的展示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels () {
      try {
        // const { data: res } = await getUserChannels()
        // this.channelList = res.data.channels
        let channels = []

        if (this.user) {
          // 已登录，请求获取线上用户频道列表
          const { data: res } = await getUserChannels()
          channels = res.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          //    有，拿来使用
          if (localChannels) {
            channels = localChannels
          } else {
            //    没有，请求获取默认频道列表
            const { data: res } = await getUserChannels()
            channels = res.data.channels
          }
        }
        this.channelList = channels
      } catch (err) {
        this.$toast('获取频道失败!')
      }
    },
    updateActive (index, isEditShow = true) {
      this.active = index
      this.isChennelEditShow = isEditShow
    },
    closePopup () {
      this.$refs.channelEditRef.closeMethods()
      // console.log(this.$refs.channelEditRef.isEdit)
    }
  }

}
</script>

<style lang="less" scoped>
.home-container{
  padding-top: 181px;
  padding-bottom: 100px;
  .page-nav-bar{
  .van-nav-bar__title{
    max-width: unset;
  }
  .search-btn{
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon{
      font-size: 32px;
    }
  }
}
/deep/ .channel-tabs{
  .van-tabs__content {
    // 响应式布局单位：vm 和 vh
    // vm : 1vm = 布局视口宽度1%
    // vh : 1vh = 布局视口高度1%
    min-height: 79vh;
  }

  .van-tabs__wrap{
    position: fixed;
    top: 92px;
    z-index: 1;
    left: 0;
    right: 0;

  }
  .van-tab{
    min-width: 200px;
    font-size: 30px;
    color: #777;
    border-right: 1px solid #edeff3;
  }
  .van-tab--active{
    color: #333;
  }
  .van-tabs__nav {
    padding-bottom: 0;
  }
  .van-tabs__line{
    bottom: 8px;
    width: 31px !important;
    height: 6px;
    background-color: #3296fa;
  }
  .hunburger-btn{
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.902;
    i.toutiao{
      font-size: 33px;
    }
    &::before{
      content: '';
      position: absolute;
      left: 0;
      width: 1px;
      height: 100%;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }

  }

  .place-holder {
    flex-shrink: 0;
    width: 66px;
    height: 82px;
  }
}
}

</style>
