<template>
  <div class="channel-list">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button type="danger" round plain size="mini" class="edit-btn" @click="editBtn">{{isEdit ? '完成' : '编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item @click="removeChannel(value,index)" v-for="(value,index) in myChannels" :key="index" class="gird-item" >
        <van-icon v-show="isEdit && !fixedChannels.includes(value.id)" name="close" slot="icon"/>
        <!--
          v-bind:class 语法
          一个对象，对象中的 key 表示要作用的 css 类名
                   对象中的 value 要计算出布尔值
                   true: 则作用该类名
                   false:  不作用类名
         -->
        <span slot="text" class="text" :class="{active:index === active}">
          {{value.name}}
        </span>
      </van-grid-item>
    </van-grid>
    <!-- /我的频道 -->

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid direction="horizontal" :gutter="10">
      <van-grid-item icon="plus" @click="addMyChannel(item)" v-for="(item,index) in recommandChannels" :key="index" :text="item.name" class="gird-item" ></van-grid-item>
    </van-grid>
    <!-- /频道推荐 -->

  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false, // 控制编辑状态
      fixedChannels: [0] // 固定频道，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    // 计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommandChannels () {
      // const channels = []
      // this.allChannels.forEach(item => {
      //   // find遍历数组，找到满足条件的元素项，返回true
      //   const ret = this.myChannels.find(channel => {
      //     return channel.id === item.id
      //   })
      //   if (!ret) {
      //     channels.push(item)
      //   }
      // })
      // return channels

      // 简化版
      return this.allChannels.filter(item => {
        return !this.myChannels.find(channel => {
          return item.id === channel.id
        })
      })
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data: res } = await getAllChannels()
        this.allChannels = res.data.channels
        console.log(this.allChannels)
      } catch (err) {
        console.log('请求失败', err)
      }
    },
    async addMyChannel (channel) {
      this.myChannels.push(channel)

      // 数据持久化处理
      if (this.user) {
        // 已登录，把数据请求接口放到线上
        try {
          await addUserChannel({
            id: channel.id, // 频道ID
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    editBtn () {
      this.isEdit = !this.isEdit
    },
    removeChannel (value, index) {
      if (this.isEdit) {
        if (this.fixedChannels.includes(value.id)) {
          // 1.如果是固定频道，则不删除
          return
        }
        // 2.删除频道项
        this.myChannels.splice(index, 1)
        // 3.编辑状态，执行删除操作
        if (index <= this.active) {
          // 如果删除 的激活频道之前的频道，则更新激活的频道项
          // 让激活的索引-1
          this.$emit('update-active', this.active - 1, true)
        }

        // 4.处理持久化
        this.deleteChannel(value.id)
      } else {
        // 4.非编辑状态，执行切换操作
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (id) {
      if (this.user) {
        // 已登录，则将数据更新到线上
        try {
          await deleteUserChannel(id)
        } catch (err) {
          this.$toast('删除指定频道失败，请稍后再试')
        }
      } else {
        // 未登录，将数据更新到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    closeMethods () {
      this.isEdit = false
    }
  }
}
</script>

<style lang="less" scoped>
.channel-list{
  padding: 85px 0;
  .title-text{
    font-size: 32px;
    color: #333;
  }
  .edit-btn{
    font-size: 26px;
    width: 104px;
    height: 48px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .my-grid {
    .gird-item{
      .van-grid-item__icon-wrapper{
        position: absolute;
        top: -15px;
        right: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

 /deep/ .gird-item{
    width: 160px;
    height: 86px;
    .van-grid-item__content{
      background-color: #f4f5f6;
      white-space: nowrap;
      .text{
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: #f85959;
      }
      .van-grid-item__icon{
        font-size: 28px;
      }
    }
  }

}

</style>
