<template>
  <div class="gem-editor-container">
    <div class="el-editor" ref="editorElem"></div>
    <el-button type="primary" size="mini">预览</el-button>
  </div>
</template>
<script>
// import { uploadImg } from '@/api/apis'
import E from 'wangeditor'
export default {
  name: 'editorElem',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null
    }
  },
  watch: {
    content(newVal) {
      this.editor.txt.html(newVal)
    }
  },
  mounted() {
    this.editor = new E(this.$refs.editorElem)
    // 配置编辑器顶部菜单
    this.editor.customConfig.menus = [
      // 菜单配置
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      // 'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 前进
    ]
    // 粘贴过来的文本不过滤样式（保留样式）
    this.editor.customConfig.pasteFilterStyle = false
    // 使用base64上传图片
    // this.editor.customConfig.uploadImgShowBase64 = true
    // 配置onchange 触发的延迟时间
    this.editor.customConfig.onchangeTimeout = 20
    // 将图片大小限制为 1M
    this.editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024
    // 限制一次最多上传 1 张图片
    this.editor.customConfig.uploadImgMaxLength = 1
    // 自定义的上传图片方法
    // this.editor.customConfig.customUploadImg = (files, insert) => {
    // console.log(files)
    // console.log(insert)
    // let formData = new FormData()
    // formData.append('file', files)
    // uploadImg(formData)
    // insert(imgUrl)
    // }
    this.editor.customConfig.onchange = html => {
      this.$emit('update:content', html)
    }
    this.editor.create() // 创建富文本实例
  }
}
</script>
<style lang="scss" scoped>
.gem-editor-container {
  background-color: #ffffff;
  .el-editor {
    height: 650px;
  }
}
</style>
<style>
.w-e-text-container {
  height: 600px !important;
}
</style>
