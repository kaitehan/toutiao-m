<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
    class="page-nav-bar"
    title="个人信息"
    left-arrow
    @click-left="$router.back()">
    </van-nav-bar>
    <!-- /导航栏 capture="camera"  -->
    <input type="file" accept="image/*" ref="imgRef" hidden @change="onFileChange">

    <!-- 个人信息 -->
    <van-cell-group>
      <van-cell title="头像" is-link @click="$refs.imgRef.click()">
        <van-image
          class="avatar"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell title="昵称" :value="user.name" is-link @click="isNameShow=true"/>
      <van-cell title="性别" :value="user.gender === 0? '男' : '女'" is-link @click="isGenderShow=true"/>
      <van-cell title="生日" :value="user.birthday" is-link @click="isBirthdayShow=true"/>
    </van-cell-group>
    <!-- /个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup v-model="isNameShow" position="bottom" style="height:100%">
      <update-name v-if="isNameShow" v-model="user" @close="isNameShow=false"></update-name>
    </van-popup>
    <!-- /编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup v-model="isGenderShow" position="bottom" >
      <update-gender v-if="isGenderShow" v-model="user" @close="isGenderShow=false"></update-gender>
    </van-popup>
    <!-- /编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup v-model="isBirthdayShow" position="bottom" >
      <update-birthday v-if="isBirthdayShow" v-model="user" @close="isBirthdayShow=false"></update-birthday>
    </van-popup>
    <!-- /编辑生日 -->
    <!-- 编辑头像 -->
    <van-popup v-model="isPhotoShow" position="bottom" style="height:100%">
      <update-photo v-if="isPhotoShow" :img="localImg" v-model="user" @close="isPhotoShow=false"></update-photo>
    </van-popup>
    <!-- /编辑头像 -->
  </div>
</template>

<script>
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
import { getUserProfile } from '@/api/user'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  data () {
    return {
      user: {},
      isNameShow: false,
      isGenderShow: false,
      isBirthdayShow: false,
      isPhotoShow: false,
      localImg: null
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      try {
        const { data: res } = await getUserProfile()
        this.user = res.data
      } catch (err) {
        this.$toast.fail('获取用户资料失败，请稍后重试')
      }
    },
    onFileChange () {
      this.isPhotoShow = true
      // 获取文件对象
      const file = this.$refs.imgRef.files[0]
      // 基于文章对象获取  blob 数据
      this.localImg = window.URL.createObjectURL(file)

      // file-input 如果选了同一个文件不会触发 change事件
      // 解决办法就是每次使用完毕，把它的value清空
      this.$refs.imgRef.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile{
  .avatar{
    width: 60px;
    height: 60px;
  }
  .van-popup{
    background-color: #f5f7f9;
  }
}
</style>
