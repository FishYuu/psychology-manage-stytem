<template>
  <div class="pagination-fixed">
    <div class="gem-pagination">
      <el-pagination background layout="sizes, prev, pager, next, jumper" :current-page.sync="nowPage" :total="total" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" @size-change="onSizeChange" @current-change="onCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gemPagination',
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      nowPage: 1
    }
  },
  watch: {
    currentPage: {
      handler(newVal) {
        this.nowPage = newVal
      },
      immediate: true
    },
    nowPage(newVal) {
      this.$emit('update:currentPage', newVal)
    }
  },
  methods: {
    onSizeChange(ret) {
      this.$emit('size-change', ret)
    },
    onCurrentChange(ret) {
      this.$emit('current-change', ret)
    }
  }
}
</script>
<style scoped lang="scss">
.gem-pagination {
  min-width: 700px;
}
.pagination-fixed {
  min-width: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background-color: #ffffff;
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 5;
}
</style>
