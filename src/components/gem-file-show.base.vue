<template>
  <div class="">
    <div v-for="file in filesShow" :key="file.id">
      <el-link type="warning" :href="downLoadUrl + '/attach/download/1/' + file.id">{{ file.originalFileName }}</el-link>
    </div>
  </div>
</template>
<script>
import config from '../../gem.config'
import Api from '@/api/apis'
export default {
  name: 'gemFileShow',
  props: {
    fileIds: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      downLoadUrl: config.Upload_URL,
      filesShow: []
    }
  },
  watch: {
    fileIds: {
      handler() {
        if (this.fileIds) {
          const param = {
            fileIds: this.fileIds
          }
          this.$http(Api.filesInformation, param).then(ret => {
            this.filesShow = ret.files
          })
        }
      },
      immediate: true
    }
  }
}
</script>
