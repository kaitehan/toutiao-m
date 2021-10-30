// PostCSS 配置文件
module.exports = {
  // 配置要使用的PostCSS插件
  plugins: {
    // 配置使用 autoprefixer 插件
    // 作用：生成浏览器CSS样式规则前缀
    // VueCli内部已经配置了autoprefixer插件
    // 这里又配置了一次，产生冲突了
    // 'autoprefixer': {//autoprefixer 插件的配置
    //   // 配置要兼容到的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 配置使用 postcss-pxtorem 插件
    // 把 px 转为 rem
    'postcss-pxtorem': {

      // lib-flexible 的 rem 适配方案，把一行分为10份，没分就是十分之一
      // 所以 rootValue 应该设置为你的设计稿宽度的十分之一
      // 我们的设计稿是750，所以应该设置为75
      // 但是vant建议设计为37.5，由于vant是基于375设计的
      // 导致使用时设计稿尺寸必须是除2

      // 文档中显示，rootValue支持两种类型：
      //      数字：固定的数值
      //      函数：可以动态处理返回
      //          postCSS-pxtorem 处理每个 CSS 文件的时候都会来调用这个函数
      //          它会把处理的 CSS 文件相关的信息通过参数obj传递给该函数
      // rootValue: 37.5,
      rootValue ({ file }) {
        // 从obj解构出file属性，查询file路径中是否存在 vant 字样
        return file.indexOf('vant') !== -1 ? 37.5 : 75
        // return 37.5
      },

      // 配置要转换的CSS属性
      //  * 表示所有
      // propList: ['height'] //只转换高
      propList: ['*'],

      // 配置不要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}
