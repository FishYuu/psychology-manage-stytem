<template>
  <div v-if="detailShow">
    <div class="add-condition">
      <el-button type="primary" size="small" @click="optionAssessment(null, 0)">新增题组</el-button>
    </div>
    <div class="content-list">
      <el-table :data="assessmentDetail.groupList" ref="elTable" border :stripe="true" header-cell-class-name="my-table-cell">
        <el-table-column prop="assessmentGroupName" label="题组名称" width="240" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="有效性" width="240" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | roleStatusToString }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="240" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="指标" placement="top-start">
              <el-button @click="_toStandardDetail(scope.row)" icon="el-icon-collection-tag" circle size="mini" title="指标"> </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="详情" placement="top-start">
              <el-button @click="toDetail(scope.row)" icon="el-icon-search" circle size="mini" title="详情"> </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button @click="optionAssessment(scope.row, 1)" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="onDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 题组弹框 -->
    <el-dialog title="题组编辑" :visible.sync="subjectDialog" width="670px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form class="custom-form" ref="subjectDetail" :model="subjectDetail" :rules="subjectRule" size="mini" :inline="true">
        <el-form-item label="表名" label-width="90px" prop="assessmentSubjectName">
          <el-input v-model="subjectDetail.assessmentGroupName" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序号" label-width="90px" prop="groupIndex">
          <el-input-number v-model="subjectDetail.groupIndex" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" label-width="90px" prop="remark">
          <el-input v-model="subjectDetail.remark" controls-position="right"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px" required prop="status">
          <el-radio-group v-model="subjectDetail.status">
            <el-radio-button label="1">有效</el-radio-button>
            <el-radio-button label="0">无效</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assessmentClose" size="mini">关 闭</el-button>
        <el-button @click="submitAssessment" type="primary" size="mini">提 交</el-button>
      </div>
    </el-dialog>
  </div>
  <router-view v-else></router-view>
</template>
<script>
import Api from '@/api/apis'
import Filter from '@/common/js/Filters'
export default {
  mixins: [Filter],
  data() {
    return {
      detailShow: true,
      assessmentId: this.$route.query.id,
      assessmentDetail: {
        groupList: []
      },
      assessmentAction: 0,
      subjectDialog: false,
      subjectDetail: {
        assessmentGroupName: '',
        remark: '',
        status: '1',
        extractType: 0,
        groupIndex: null,
        assessmentId: this.$route.query.id
      },
      subjectRule: {
        assessmentGroupName: [{ required: true, message: '请输入表名', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._getsubjectDetail()
    })
  },
  methods: {
    toDetail(row) {
      this.$router.push({
        path: 'group-question-detail',
        query: {
          groupId: row.assessmentGroupId,
          assessmentId: row.assessmentId
        }
      })
    },
    _toStandardDetail(row) {
      this.$router.push({
        path: 'standard-detail',
        query: {
          groupId: row.assessmentGroupId,
          assessmentId: row.assessmentId
        }
      })
    },
    _getsubjectDetail() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.queryAssessmentById, { assessmentId: this.assessmentId }).then(ret => {
        loading.close()
        this.assessmentDetail = ret.assessment
      })
    },
    optionAssessment(row, action) {
      this.assessmentAction = action
      this.subjectDialog = true
      if (action === 1) {
        this.subjectDetail = JSON.parse(JSON.stringify(row))
      }
    },
    submitAssessment() {
      this.$refs.subjectDetail.validate(valid => {
        if (valid) {
          let optionText = this.assessmentAction === 0 ? '新增' : '修改'
          this.$confirm(`是否${optionText}该评测表`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.assessmentAction === 0 ? this.addAssessment() : this.editAssessment()
            })
            .catch(() => {})
        } else return false
      })
    },
    addAssessment() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      let parmas = {
        ...this.subjectDetail,
        createId: JSON.parse(sessionStorage.getItem('loginUser')).userId
      }
      this.$http(Api.addAssessmentGroup, parmas).then(ret => {
        loading.close()
        this.$message.success(ret.message)
        this.assessmentClose()
        this._getsubjectDetail()
      })
    },
    editAssessment() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      let params = {
        ...this.subjectDetail,
        updateId: JSON.parse(sessionStorage.getItem('loginUser')).userId
      }
      this.$http(Api.updateAssessmentGroup, params).then(ret => {
        loading.close()
        this.$message.success(ret.message)
        this.assessmentClose()
        this._getsubjectDetail()
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
          this.$http(Api.delAssessmentGroup, row).then(ret => {
            loading.close()
            this.$message.success(ret.message)
            this._getsubjectDetail()
          })
        })
        .catch(() => {})
    },
    assessmentClose() {
      this.$refs.subjectDetail.resetFields()
      this.subjectDialog = false
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'assessment-detail') {
        this.detailShow = true
      } else {
        this.detailShow = false
      }
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
