<template>
  <div class="image-container">
    <div class="image-item" v-for="(file, index) in filesShow" :key="file.id" @click.stop="onFilePreview(file, index)">
      <el-image style="width: 100px; height: 100px" :src="file.fileUrl" :preview-src-list="previewImageList"> </el-image>
    </div>
  </div>
</template>
<script>
import config from '../../gem.config'
export default {
  props: {
    fileIds: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      downLoadUrl: config.HOST,
      filesShow: []
    }
  },
  computed: {
    previewImageList() {
      return this.filesShow.map(file => {
        return file.fileUrl
      })
    }
  },
  watch: {
    fileIds: {
      handler() {
        if (this.fileIds) {
          this.filesShow = this.fileIds.split(',').map(file => {
            return {
              id: file,
              fileUrl: this.downLoadUrl + '/attach/download/1/' + file
            }
          })
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.image-container {
  display: flex;
  flex-wrap: wrap;
  .image-item {
    margin: 4px;
  }
}
</style>
