<template>
  <div class="common-children-container">
    <div class="cms-detail">
      <div class="cms-detail-content">
        <el-form :model="detailForm" :rules="detailFormRules" label-position="top">
          <el-tabs v-model="activeTabName">
            <el-tab-pane label="基本信息" name="base">
              <el-row :gutter="300">
                <el-col :span="10">
                  <el-form-item label="标题" prop="title">
                    <el-input v-model.trim="detailForm.title" maxlength="40" show-word-limit></el-input>
                  </el-form-item>
                  <el-form-item label="商品条码" prop="barCode">
                    <el-input v-model.trim="detailForm.barCode"></el-input>
                  </el-form-item>
                  <el-form-item label="商品简介">
                    <el-input v-model.trim="detailForm.summary" maxlength="40" show-word-limit></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-checkbox v-model="detailForm.appSale">小程序上架</el-checkbox>
                    <el-checkbox v-model="detailForm.shopSale">门店上架</el-checkbox>
                    <el-checkbox v-model="detailForm.hotSale">热销</el-checkbox>
                  </el-form-item>
                  <el-form-item>
                    <el-tag :key="index" v-for="(tag, index) in detailForm.tags" closable :disable-transitions="false" @close="onTagClose(tag)">
                      {{ tag }}
                    </el-tag>
                    <el-input class="input-new-tag" v-if="newTagInputVisible" v-model="newTagInputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleTagInputConfirm" @blur="handleTagInputConfirm"> </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showTagInputAndFocus">+ new</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item label="商品分类">
                    <el-cascader></el-cascader>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="图文详情" name="content">
              <gem-editor :content.sync="detailForm.content"></gem-editor>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
      <div class="detail-submit">
        <!-- <div class="detail-operation">
          <el-button size="mini" @click="$router.back(-1)">取消</el-button>
        </div> -->
        <div class="detail-operation">
          <el-button size="mini" type="primary" :disabled="!isFormChange" @click="formSubmit">提交/保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeTabName: 'base', // 激活的tab名字（基本信息，图文详情）
      initFormPhoto: '', // 记住第一次请求后的数据拍照
      newTagInputVisible: false, // 新增标签时，标签输入框的显示和隐藏
      newTagInputValue: '', // 新增标签时，记录当前输入的值
      detailForm: {
        title: '',
        barCode: '',
        content: '',
        summary: '',
        appSale: true,
        shopSale: true,
        hotSale: false,
        tags: ['热销', '甜品', '很多人买', '口味好', '网红', '精品', '用了都说好']
      },
      detailFormRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        barCode: [{ required: true, message: '请输入商品条码', trigger: 'blur' }]
      }
    }
  },
  computed: {
    isFormChange() {
      return !(JSON.stringify(this.detailForm) === this.initFormPhoto)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isFormChange) {
      next(false)
      this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
        distinguishCancelAndClose: true,
        dangerouslyUseHTMLString: true,
        confirmButtonText: '保存',
        cancelButtonText: '放弃修改',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'info',
            message: '保存修改'
          })
        })
        .catch(action => {
          action === 'cancel' ? next() : next(false)
        })
    } else {
      next()
    }
  },
  created() {
    this._initData()
  },
  methods: {
    _initData() {
      setTimeout(() => {
        this.detailForm.title = '没有什么问题'
        this.detailForm.barCode = '没有什么问题22'
        this.detailForm.summary = '没有什么问题22'
        this.takeFormPhotos()
      }, 200)
    },
    takeFormPhotos() {
      this.initFormPhoto = JSON.stringify(this.detailForm)
    },
    formSubmit() {},
    onTagClose(tag) {
      this.detailForm.tags.splice(this.detailForm.tags.indexOf(tag), 1)
    },
    handleTagInputConfirm() {
      let newTagInputValue = this.newTagInputValue
      if (newTagInputValue) {
        this.detailForm.tags.push(newTagInputValue)
      }
      this.newTagInputVisible = false
      this.newTagInputValue = ''
    },
    showTagInputAndFocus() {
      this.newTagInputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.cms-detail {
  padding: 16px 16px 110px;
  .detail-submit {
    position: fixed;
    bottom: 16px;
    padding: 20px;
    left: 50%;
    margin-left: -350px;
    width: 700px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 10px #ddd;
    border-radius: 6px;
    .detail-operation {
      margin: 0 10px;
    }
  }
}
</style>
<style lang="scss">
.cms-detail {
  .el-tag {
    margin-right: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
