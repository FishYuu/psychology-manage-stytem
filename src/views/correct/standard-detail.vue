<template>
  <div>
    <div class="add-condition">
      <el-button type="primary" size="small" @click="optionAssessmentStandard(null, 0)">新增</el-button>
    </div>
    <div class="content-list">
      <el-table :data="assessmentStandardList" ref="elTable" border :stripe="true" header-cell-class-name="my-table-cell">
        <el-table-column prop="assessmentTarget" label="目标" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="assessmentStandard" label="指标名称" width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="minScore" label="最小值（包含)" width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="maxScore" label="最大值（包含)" width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="scoreExplain" label="分数阐释" width="240" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="resultExplain" label="结果阐释" width="240" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="result" label="结论" width="240" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="结论备注" width="240" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button @click="optionAssessmentStandard(scope.row, 1)" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="onDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 指标弹框 -->
    <el-dialog title="指标编辑" :visible.sync="StandardDialog" width="670px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form class="custom-form" ref="StandardDetail" :model="StandardDetail" :rules="StandardRule" size="mini">
        <el-form-item label="目标" label-width="120px" prop="assessmentTarget">
          <el-input v-model="StandardDetail.assessmentTarget" clearable></el-input>
        </el-form-item>
        <el-form-item label="指标名称" label-width="120px" prop="assessmentStandard">
          <el-input v-model="StandardDetail.assessmentStandard" clearable></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最小值（包含)" label-width="120px" prop="minScore">
              <el-input-number v-model="StandardDetail.minScore" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大值（包含)" label-width="120px" prop="maxScore">
              <el-input-number v-model="StandardDetail.maxScore" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="分数阐释" label-width="120px" prop="scoreExplain">
          <el-input v-model="StandardDetail.scoreExplain" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="结果阐释" label-width="120px" prop="resultExplain">
          <el-input v-model="StandardDetail.resultExplain" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="结论" label-width="120px" prop="result">
          <el-input v-model="StandardDetail.result" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="结论备注" label-width="120px" prop="remark">
          <el-input v-model="StandardDetail.remark" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="standardClose" size="mini">关 闭</el-button>
        <el-button @click="submitAssessment" type="primary" size="mini">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Api from '@/api/apis'
import Filter from '@/common/js/Filters'
export default {
  mixins: [Filter],
  data() {
    return {
      assessmentId: this.$route.query.assessmentId,
      groupId: this.$route.query.groupId,
      assessmentStandardList: [],
      standardAction: 0,
      StandardDialog: false,
      StandardDetail: {
        assessmentId: this.$route.query.assessmentId,
        assessmentGroupId: this.$route.query.groupId,
        assessmentStandard: '',
        assessmentTarget: '',
        minScore: null,
        maxScore: null,
        result: '',
        remark: '',
        resultExplain: '',
        scoreExplain: ''
      },
      StandardRule: {
        assessmentStandard: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
        minScore: [{ required: true, message: '请输入最小值', trigger: 'blur' }],
        maxScore: [{ required: true, message: '请输入最大值', trigger: 'blur' }],
        scoreExplain: [{ required: true, message: '请输入分数阐释', trigger: 'blur' }],
        assessmentTarget: [{ required: true, message: '请输入目标', trigger: 'blur' }],
        resultExplain: [{ required: true, message: '结果阐释', trigger: 'blur' }],
        result: [{ required: true, message: '请输入结论', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._getStandardList()
    })
  },
  methods: {
    _getStandardList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      let params = {
        assessmentGroupId: this.groupId,
        assessmentId: this.assessmentId
      }
      this.$http(Api.queryAssessmentStandardList, { assessmentId: this.assessmentId }).then(ret => {
        loading.close()
        this.assessmentStandardList = ret.assessmentStandardList
      })
    },
    optionAssessmentStandard(row, action) {
      this.standardAction = action
      this.StandardDialog = true
      if (action === 1) {
        this.StandardDetail = JSON.parse(JSON.stringify(row))
      }
    },
    submitAssessment() {
      this.$refs.StandardDetail.validate(valid => {
        if (valid) {
          if (this.StandardDetail.minScore >= this.StandardDetail.maxScore) {
            this.$message.warning('最小值不得大于等于最大值！')
            return false
          }
          let optionText = this.standardAction === 0 ? '新增' : '修改'
          this.$confirm(`是否${optionText}该指标`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.standardAction === 0 ? this.addStandard() : this.editStandard()
            })
            .catch(() => {})
        } else return false
      })
    },
    addStandard() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      let parmas = {
        ...this.StandardDetail,
        createId: JSON.parse(sessionStorage.getItem('loginUser')).userId
      }
      console.log(parmas)
      this.$http(Api.addAssessmentStandard, parmas).then(ret => {
        loading.close()
        this.$message.success(ret.message)
        this.standardClose()
        this._getStandardList()
      })
    },
    editStandard() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      let params = {
        ...this.StandardDetail,
        updateId: JSON.parse(sessionStorage.getItem('loginUser')).userId
      }
      this.$http(Api.updateAssessmentStandard, params).then(ret => {
        loading.close()
        this.$message.success(ret.message)
        this.standardClose()
        this._getStandardList()
      })
    },
    onDelete(row) {
      this.$confirm('确认删除？', '提示', {
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
          this.$http(Api.delAssessmentStandard, row).then(ret => {
            loading.close()
            this.$message.success(ret.message)
            this._getStandardList()
          })
        })
        .catch(() => {})
    },
    standardClose() {
      this.$refs.StandardDetail.resetFields()
      this.StandardDialog = false
    }
  }
}
</script>
<style lang="scss" scoped>
.content-list {
  display: inline-block;
  padding: 16px;
}
.add-condition {
  padding: 16px;
}
</style>
