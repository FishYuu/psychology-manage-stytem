<template>
  <div>
    <div class="filters-form">
      <el-form class="filters" ref="searchForm" :inline="true" size="medium">
        <el-button type="primary" size="medium" @click="optionSubject(null, 0)">新增题目</el-button>
      </el-form>
    </div>
    <div class="detail">
      <el-collapse v-model="activeNames" @change="handleChange" accordion>
        <el-collapse-item :name="index" v-for="(item, index) in assessmentSubjectList" :key="index">
          <template slot="title">
            <div class="subject-title">
              <span class="title">{{ item.subjectNo }}. {{ item.assessmentSubjectName }}</span>
              <span class="del-btn">
                <el-button type="primary" size="mini" @click="optionSubject(item, 1)">修改</el-button>
                <el-button type="primary" size="mini" @click="delSubject(item)">删除</el-button>
              </span>
            </div>
          </template>
          <div>
            <div style="padding: 10px 0;">
              <el-button type="primary" size="small" @click="addOptions">新增选项</el-button>
            </div>
            <div class="table-form">
              <el-table :data="qusetionOptionsList" ref="elTable" border :stripe="true" header-cell-class-name="my-table-cell">
                <el-table-column prop="optionContent" label="选项名称" width="240" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="score" label="评分" width="240" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="补充说明" width="240" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.isHaveExplain | roleStatusToString }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="optionIndex" label="排序号" width="120" align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column label="操作" align="center" width="240">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                      <el-button @click="optionMsg(scope.row, 1)" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                      <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="onDeleteOpeation(scope.row)"></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <!-- 选项弹框 -->
      <el-dialog title="选项编辑" :visible.sync="optionsDialog" width="670px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <el-form class="custom-form" ref="optionsDetail" :model="optionsDetail" :rules="optionsRule" size="mini" :inline="true">
          <el-form-item label="选项内容" label-width="90px" prop="optionContent">
            <el-input v-model="optionsDetail.optionContent" clearable></el-input>
          </el-form-item>
          <el-form-item label="评分" label-width="90px" prop="score">
            <el-input-number v-model="optionsDetail.score" controls-position="right"></el-input-number>
          </el-form-item>
          <el-form-item label="排序号" label-width="90px" prop="optionIndex">
            <el-input-number v-model="optionsDetail.optionIndex" controls-position="right"></el-input-number>
          </el-form-item>
          <el-form-item label="补充说明" label-width="120px" required prop="isHaveExplain">
            <el-radio-group v-model="optionsDetail.isHaveExplain">
              <el-radio-button label="1">有</el-radio-button>
              <el-radio-button label="0">无</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="optionsClose" size="mini">关 闭</el-button>
          <el-button @click="submitOptions" type="primary" size="mini">提 交</el-button>
        </div>
      </el-dialog>
      <!-- 题目弹框 -->
      <el-dialog title="题目编辑" :visible.sync="subjectDialog" width="670px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <el-form class="custom-form" ref="subjectDetail" :model="subjectDetail" :rules="subjectRule" size="mini" :inline="true">
          <el-form-item label="题目名称" label-width="90px" prop="assessmentSubjectName">
            <el-input v-model="subjectDetail.assessmentSubjectName" clearable></el-input>
          </el-form-item>
          <el-form-item label="测评类型" label-width="90px" prop="assessmentType">
            <el-select v-model="subjectDetail.assessmentType" placeholder="请选择测评类型" clearable>
              <el-option v-for="item in subjectEvaluateList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题目类型" label-width="90px" prop="subjectType">
            <el-select v-model="subjectDetail.subjectType" placeholder="请选择题目类型" clearable>
              <el-option v-for="item in subjectTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" label-width="120px" prop="remark">
            <el-input v-model="subjectDetail.remark" type="textarea" :rows="2" clearable></el-input>
          </el-form-item>
          <el-form-item label="题目编号" label-width="90px" prop="subjectNo">
            <el-input v-model="subjectDetail.subjectNo" placeholder="示例：AB1"></el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="120px" required prop="status">
            <el-radio-group v-model="subjectDetail.status">
              <el-radio-button label="1">有效</el-radio-button>
              <el-radio-button label="0">无效</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="subjectClose" size="mini">关 闭</el-button>
          <el-button @click="submitsubject" type="primary" size="mini">提 交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Api from '@/api/apis'
import Filter from '@/common/js/Filters'
export default {
  filters: {
    roleStatusToString(val) {
      if (val === 1 || val === '1') {
        return '存在'
      }
      if (val === 0 || val === '0') {
        return '不存在'
      }
    }
  },
  mixins: [Filter],
  data() {
    return {
      optionsDialog: false,
      optionAction: 0,
      optionsDetail: {
        optionContent: '',
        score: null,
        isHaveExplain: '0',
        optionIndex: null
      },
      optionsRule: {
        optionContent: [{ required: true, message: '请输入选项内容', trigger: 'blur' }]
      },
      activeNames: ['1'],
      assessmentGroupId: this.$route.query.groupId,
      assessmentSubjectList: [],
      selectItem: {},
      selectOption: {},
      qusetionOptionsList: [],
      subjectDialog: false,
      subjectAction: 0,
      subjectDetail: {
        assessmentGroupId: this.$route.query.groupId,
        assessmentId: this.$route.query.assessmentId,
        assessmentSubjectName: '',
        assessmentType: '',
        createId: JSON.parse(sessionStorage.getItem('loginUser')).userId,
        remark: '',
        status: '1',
        subjectNo: '',
        subjectType: ''
      },
      subjectRule: {
        assessmentSubjectName: [{ required: true, message: '请输入题目名称', trigger: 'blur' }],
        assessmentType: [{ required: true, message: '请选择测评类型', trigger: 'change' }],
        subjectType: [{ required: true, message: '请选择题目类型', trigger: 'change' }],
        subjectNo: [{ required: true, message: '请填写题目编号', trigger: 'blur' }]
      },
      subjectTypeList: [
        { label: '单选', value: 'EC' },
        { label: '多选', value: 'MC' },
        { label: '填空', value: 'FTB' }
      ],
      subjectEvaluateList: [
        { label: '自评', value: 'ZP' },
        { label: '他评', value: 'TP' }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._getAssessmentDetail()
    })
  },
  methods: {
    handleChange(val) {
      console.log(val)
      this.selectItem = this.assessmentSubjectList[val]
      this.getSelectQuestionOption()
    },
    _getAssessmentDetail() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.queryAssessmentSubjectPage, { assessmentGroupId: this.assessmentGroupId }).then(ret => {
        loading.close()
        this.assessmentSubjectList = ret.assessmentSubjectList
      })
    },
    getSelectQuestionOption(val) {
      this.$http(Api.queryAssessmentOptionList, { assessmentSubjectId: this.selectItem.assessmentSubjectId }).then(ret => {
        this.qusetionOptionsList = ret.assessmentOptionList
      })
    },
    optionMsg(row, action) {
      this.optionAction = action
      this.optionsDialog = true
      if (action === 1) {
        this.optionsDetail = JSON.parse(JSON.stringify(row))
      }
    },
    addOptions() {
      this.optionsDialog = true
      this.optionAction = 0
      let length = this.qusetionOptionsList.length
      // this.optionsDetail.optionIndex = this.qusetionOptionsList[length-1].
    },
    submitOptions() {
      this.$refs.optionsDetail.validate(valid => {
        if (valid) {
          this.optionAction === 0 ? this.addOptionItem() : this.editOptions()
        } else return false
      })
    },
    addOptionItem() {
      if (this.qusetionOptionsList.filter(item => item.isHaveExplain === 1).length > 0 && this.optionsDetail.isHaveExplain === 1) {
        this.$message.warning('该题仅有一个选项可备注！')
        return false
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      let parmas = {
        ...this.optionsDetail,
        assessmentSubjectId: this.selectItem.assessmentSubjectId,
        createId: JSON.parse(sessionStorage.getItem('loginUser')).userId
      }
      this.$http(Api.addAssessmentOption, parmas).then(ret => {
        loading.close()
        this.$message.success(ret.message)
        this.optionsClose()
        this.getSelectQuestionOption()
      })
    },
    editOptions() {
      if (this.qusetionOptionsList.filter(item => item.isHaveExplain == 1).length > 0 && this.optionsDetail.isHaveExplain === 1) {
        this.$message.warning('该题仅有一个选项可备注！')
        return false
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      let parmas = {
        ...this.optionsDetail,
        updateId: JSON.parse(sessionStorage.getItem('loginUser')).userId
      }
      this.$http(Api.updateAssessmentOption, parmas).then(ret => {
        loading.close()
        this.$message.success(ret.message)
        this.optionsClose()
        this.getSelectQuestionOption()
      })
    },
    onDeleteOpeation(row) {
      this.$confirm(`是否删除该选项`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            background: 'rgba(255, 255, 255, 0.5)'
          })
          this.$http(Api.delAssessmentOption, row).then(ret => {
            loading.close()
            this.$message.success(ret.message)
            this.getSelectQuestionOption()
          })
        })
        .catch(() => {})
    },
    optionSubject(row, action) {
      this.subjectAction = action
      this.subjectDialog = true
      if (action === 1) {
        this.subjectDetail = JSON.parse(JSON.stringify(row))
      }
    },
    optionsClose() {
      this.$refs.optionsDetail.resetFields()
      this.optionsDialog = false
    },
    submitsubject() {
      this.$refs.subjectDetail.validate(valid => {
        if (valid) {
          let optionText = this.subjectAction === 0 ? '新增' : '修改'
          this.$confirm(`是否${optionText}该评测表`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              const loading = this.$loading({
                lock: true,
                text: 'Loading',
                background: 'rgba(255, 255, 255, 0.5)'
              })
              if (this.subjectAction === 1) {
                this.subjectDetail.updateId = JSON.parse(sessionStorage.getItem('loginUser')).userId
              }
              let urlLink = ''
              this.subjectAction === 0 ? (urlLink = Api.addAssessmentSubject) : (urlLink = Api.updateAssessmentSubject)
              this.$http(urlLink, this.subjectDetail).then(ret => {
                loading.close()
                this.$message.success(ret.message)
                this.subjectClose()
                this._getAssessmentDetail()
              })
            })
            .catch(() => {})
        } else return false
      })
    },
    delSubject(row) {
      this.$confirm('确认删除该项题目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            background: 'rgba(255, 255, 255, 0.5)'
          })
          this.$http(Api.delAssessmentSubject, row).then(ret => {
            loading.close()
            this.$message.success(ret.message)
            this._getAssessmentDetail()
          })
        })
        .catch(() => {})
    },
    subjectClose() {
      this.$refs.subjectDetail.resetFields()
      this.subjectDialog = false
    }
  }
}
</script>
<style lang="scss" scoped>
.detail {
  margin: 16px;
  padding: 16px;
  background-color: #ffffff;
}
.subject-title {
  position: relative;
  width: 100%;
  .title {
    font-weight: bold;
    margin-right: 60px;
  }
  .del-btn {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
}
.table-form {
  display: inline-block;
}
.filters-form {
  padding: 16px;
}
</style>
