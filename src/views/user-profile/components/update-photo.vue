<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img">

    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>

</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  props: {
    img: {
      type: [String, Object],
      required: true
    },
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  created () {},
  methods: {
    onConfirm () {
      // 1.用于服务器端裁切，该方法可以得到裁切区域参数   适用于PC端
      // console.log(this.cropper.getData())

      // 2.用于客户端裁切，该方法得到的是裁切后的图片  使用与移动端  在PC端使用存在一定的兼容性问题
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        this.$toast.loading({
          message: '保存中...',
          forbidClick: true,
          duration: 0
        })
        try {
          // console.log(blob)
        // 如果接口要求 Content-Type 是 application/json
        // 则传递普通 JavaScript 对象
        // const { data: res } = await updateUserPhoto(blob)

          // 如果接口要求 Content-Type 是  multipart/form-data
          // 则你必须传递 FormData 对象
          const formData = new FormData()
          formData.append('photo', blob)
          const { data: res } = await updateUserPhoto(formData)
          this.value.photo = res.data.photo
          this.$emit('input', this.value)
          this.$emit('close')
          this.$toast.success('更新成功')
        } catch (err) {
          this.$toast.fail('更新失败')
        }
      })
    }
  },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      // 查看模式，限制选择框不能超出画布大小
      viewMode: 1,
      // 图片移动移动，选择框不能动
      dragMode: 'move',
      // 选择框显示比例
      aspectRatio: 1,
      autoCropArea: 1,
      // 选择框不动
      cropBoxMovable: false,
      // 选择框是否可以缩放
      cropBoxResizable: false,
      // 关闭背景
      background: false,
      // 画布图片可以移动
      movable: true
    })
  }

}
</script>

<style lang="less" scoped>
.update-photo{
  height: 100%;
  background-color: rgba(#000, 0.8);
  .toolbar{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    .cancel,.confirm{
      width: 90px;
      height: 90px;
      font-size: 30px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .img{
    display: block;
    max-width: 100%;
  }
}

</style>
