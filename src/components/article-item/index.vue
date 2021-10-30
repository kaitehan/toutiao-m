<template>
<!--
  Cell单元格中的 to 属性 和 VueRouter 中的 RouterLink 导航组件中的 to 属性用法是一样的
  :to="'/article/'+article.art_id"
  :to="`/article/${article.art_id}`"

 -->
  <van-cell
  class="article-item"
  :to="{
     //根据路由名称进行跳转
     name:'article',

     //传递路由动态参数
     params:{
       //属性名：路由路径中设计的动态参数名称
       articleId:article.art_id
     }
  }">
    <div slot="title" class="title van-multi-ellipsis--l2">{{article.title}}</div>
    <div slot="label">
      <div class="cover-wrap" v-if="article.cover.type===3">
        <div class="cover-item" v-for="(item,index) in article.cover.images"  :key="index">
           <van-image
            class="cover-item-img"
              :src="item"
              fit="cover"
            />
        </div>
      </div>
      <div class="label-info-wrap">
        <span>{{article.aut_name}}</span>
        <span>{{article.comm_count}}评论</span>
        <span>{{article.pubdate | relaviteTime}}</span>
      </div>
    </div>
    <van-image
      v-if="article.cover.type===1"
      slot="default"
      class="right-class"
      fit="cover"
      :src="article.cover.images[0]"
    />

  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  created () {},
  methods: {}

}
</script>

<style lang="less" scoped>
.article-item{
  .title{
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value{
    flex: unset;
    padding-left: 25px;
    width: 232px;
    height: 146px;
  }
  .right-class{
    width: 232px;
    height: 146px;
  }
  .label-info-wrap{
    font-size: 22px;
    color: #b4b4b4;
    span{
      margin-right: 25px;
    }
  }
  .cover-wrap{
    display: flex;
    padding: 30px 0;
    .cover-item{
      flex: 1;
      height: 146px;
      &:not(:last-child){
        margin-right: 4px;
      }
      .cover-item-img{
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
