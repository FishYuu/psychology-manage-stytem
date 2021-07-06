<template>
  <div class="cms-list" v-if="containerIsShow">
    <div class="filters-form">
      <el-form class="filters" ref="searchForm" :inline="true" size="medium">
        <el-button type="primary" size="medium" @click="optionMsg(null, 0)">新增测评表</el-button>
        <el-button type="warning" size="medium" @click="stageVisible = true">新增阶段表</el-button>
        <el-button type="warning" size="medium" :disabled="selectRows.length === 0" @click="stageOptionVisible = true">选择阶段表</el-button>
      </el-form>
    </div>
    <div class="content-list">
      <el-table :data="assessementList" ref="assessementList" border :stripe="true" header-cell-class-name="my-table-cell" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="assessmentName" label="表名" width="240" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="有效性" width="240" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | roleStatusToString }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="240" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
              <el-button @click="toDetail(scope.row)" icon="el-icon-view" circle size="mini" title="查看"> </el-button>
            </el-tooltip>
            <!-- <el-tooltip class="item" effect="dark" content="阶段" placement="top-start">
              <el-button @click="toStageList(scope.row)" icon="el-icon-more" circle size="mini" title="阶段"></el-button>
            </el-tooltip> -->
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
    <gem-pagination :current-page.sync="listFilterForm.pageIndex" :page-size="listFilterForm.pageSize" :total="listTotal" @size-change="onPageSizeChange" @current-change="onCurrentChange"></gem-pagination>
    <!-- 新增菜单 -->
    <el-dialog title="新增测评表" :visible.sync="dialogAddFormVisible" width="560px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form class="custom-form" ref="addFormDetail" :model="addFormDetail" :rules="addFormDetailRule" size="mini">
        <el-form-item label="表名" label-width="120px" prop="assessmentName">
          <el-input v-model="addFormDetail.assessmentName" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="120px" prop="remark">
          <el-input v-model="addFormDetail.remark" clearable></el-input>
        </el-form-item>
        <el-form-item label="有效性" label-width="120px" required prop="status">
          <el-radio-group v-model="addFormDetail.status">
            <el-radio-button label="1">有效</el-radio-button>
            <el-radio-button label="0">无效</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitForm" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 阶段表 -->
    <el-dialog title="阶段信息" :visible.sync="stageVisible" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form class="custom-form" ref="stageDetail" :model="stageDetail" :rules="stageDetailRule" size="mini" :inline="true">
        <el-form-item label="名称" label-width="100px" prop="phaseName">
          <el-input v-model="stageDetail.phaseName" clearable></el-input>
        </el-form-item>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="距离社区矫正开始天数" label-width="180px" prop="startDay">
              <el-input-number v-model="stageDetail.startDay" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="距离社区矫正结束天数" label-width="180px" prop="endDay">
              <el-input-number v-model="stageDetail.endDay" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-form-item>
          <el-button type="primary" @click="sureOptionStage" size="mini">确 定</el-button>
        </el-form-item>
      </el-form>
      <div class="table-list">
        <el-table :data="stageList" ref="elTable" border :stripe="true" header-cell-class-name="my-table-cell">
          <el-table-column prop="phaseName" label="名称" width="240" align="center" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="startDay" label="距离社区矫正开始天数" width="180" align="center" show-overflow-tooltip></el-table-column> -->
          <!-- <el-table-column prop="endDay" label="距离社区矫正结束天数" width="180" align="center" show-overflow-tooltip></el-table-column> -->
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <el-button @click="optionStage(scope.row, 1)" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="onDeleteStage(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelStage" size="mini">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 选择阶段 -->
    <el-dialog title="阶段选择" :visible.sync="stageOptionVisible" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-checkbox-group v-model="selectOptionStageList" size="small">
        <el-checkbox :label="item.phaseId" border v-for="item in stageList" :key="item.phaseId">{{ item.phaseName }}</el-checkbox>
      </el-checkbox-group>
      <!-- <div class="table-list">
        <el-table :data="stageList" ref="elTable" border :stripe="true" header-cell-class-name="my-table-cell" @selection-change="selectOptionStage">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="phaseName" label="名称" width="240" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
      </div> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeStage" size="mini">关 闭</el-button>
        <el-button @click="_optionStage" type="primary" size="mini">确 认</el-button>
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
      containerIsShow: true,
      dialogAddFormVisible: false,
      addFormDetail: {
        assessmentName: '',
        status: '1',
        phaseId: '',
        remark: ''
      },
      Action: null,
      addFormDetailRule: {
        assessmentName: [{ required: true, message: '请输入表名', trigger: 'blur' }],
        phaseId: [{ required: true, message: '请选择阶段', trigger: 'change' }]
      },
      assessementList: [],
      stageVisible: false,
      stageList: [],
      stageAction: 0,
      stageDetail: {
        phaseName: ''
        // startDay: null,
        // endDay: null
      },
      stageDetailRule: {
        phaseName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
        // startDay: [{ required: true, message: '请输入距离社区矫正开始天数', trigger: 'blur' }],
        // endDay: [{ required: true, message: '请输入距离社区矫正结束天数', trigger: 'blur' }]
      },
      selectRows: [],
      stageOptionVisible: false,
      selectOptionStageList: [],
      assessStageList: [],
      listTotal: 0,
      listFilterForm: {
        pageIndex: 1,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this._getAssessmentList()
      this._getStageList()
    },
    // 获取所有菜单
    _getAssessmentList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.queryAssessmentPage, { pageNum: this.listFilterForm.pageIndex, pageSize: this.listFilterForm.pageSize }).then(ret => {
        loading.close()
        this.listTotal = ret.total
        this.assessementList = ret.assessmentList
      })
    },
    _getStageList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.queryPhasePage).then(ret => {
        loading.close()
        this.stageList = ret.phaseList
      })
    },
    toStageList(row) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.queryAssessmentPage, { assessmentId: row.assessmentId }).then(ret => {
        loading.close()
        this.assessStageList = ret.assessStageList
      })
    },
    submitForm() {
      this.$refs.addFormDetail.validate(valid => {
        if (valid) {
          this.Action === 0 ? this.addMenuOption() : this.editMenuOption()
        }
      })
    },
    handleSelectionChange(val) {
      this.selectRows = val
    },
    selectOptionStage(val) {
      this.selectOptionStageList = val
    },
    _optionStage() {
      this.$confirm(`确定添加?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let _list = []
          this.selectRows.map(assessItem => {
            this.selectOptionStageList.map(stageItem => {
              console.log(assessItem)
              console.log(stageItem)
              _list.push({
                assessmentId: assessItem.assessmentId,
                phaseId: stageItem
              })
            })
          })
          // console.log(_list)
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            background: 'rgba(255, 255, 255, 0.5)'
          })
          this.$http(Api.addAssessmentPhaseList, JSON.stringify(_list)).then(ret => {
            loading.close()
            this.closeStage()
            this.$message.success(ret.message)
          })
        })
        .catch(() => {})
    },
    // 添加菜单
    addMenuOption() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      let parmas = {
        ...this.addFormDetail,
        createId: JSON.parse(sessionStorage.getItem('loginUser')).userId
      }
      this.$http(Api.addAssessment, parmas).then(ret => {
        loading.close()
        this.$message.success(ret.message)
        this._getAssessmentList()
        this.cancelAdd()
      })
    },
    // 修改菜单
    editMenuOption() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.addFormDetail.updateId = JSON.parse(sessionStorage.getItem('loginUser')).userId
      this.$http(Api.updateAssessment, this.addFormDetail).then(ret => {
        loading.close()
        this.$message.success(ret.message)
        this._getAssessmentList()
        this.cancelAdd()
      })
    },
    optionMsg(row, action) {
      this.dialogAddFormVisible = true
      this.Action = action
      if (action === 1) {
        this.addFormDetail = JSON.parse(JSON.stringify(row))
      }
    },
    onDeleteOpeation(row) {
      this.$confirm(`是否删除该选项?`, '提示', {
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
          this.$http(Api.delAssessment, { assessmentId: row.assessmentId }).then(ret => {
            loading.close()
            this.$message.success(ret.message)
            this._getAssessmentList()
          })
        })
        .catch(() => {})
    },
    sureOptionStage() {
      this.$refs.stageDetail.validate(valid => {
        if (valid) {
          this.$confirm(`确认提交？`, '提示', {
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
              let params = {
                ...this.stageDetail
              }
              if (this.stageAction === 1) {
                params.updateId = JSON.parse(sessionStorage.getItem('loginUser')).userId
              } else {
                params.createId = JSON.parse(sessionStorage.getItem('loginUser')).userId
              }
              this.$http(this.stageAction === 0 ? Api.addPhase : Api.updatePhase, params).then(ret => {
                loading.close()
                this.$message.success(ret.message)
                this.$refs.stageDetail.resetFields()
                this.stageAction = 0
                this._getStageList()
              })
            })
            .catch(() => {})
        } else return false
      })
    },
    optionStage(row) {
      this.stageDetail = row
      this.stageAction = 1
    },
    closeStage() {
      this.stageOptionVisible = false
      this.selectOptionStageList = []
      this.selectRows = []
      this.$refs.assessementList.clearSelection()
    },
    onDeleteStage(row) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.delPhase, row).then(ret => {
        loading.close()
        this.$message.success(ret.message)
        this._getStageList()
      })
    },
    toDetail(row) {
      this.$router.push({
        path: '/assessment-detail',
        query: {
          id: row.assessmentId
        }
      })
    },
    cancelAdd() {
      this.$refs.addFormDetail.resetFields()
      this.stageAction = 0
      this.dialogAddFormVisible = false
    },
    cancelStage() {
      this.$refs.stageDetail.resetFields()
      this.stageVisible = false
    },
    onPageSizeChange(retSize) {
      this.listFilterForm.pageSize = retSize
      this._getAssessmentList()
    },
    onCurrentChange(current) {
      this.listFilterForm.pageIndex = current
      this._getAssessmentList()
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'assessment-list') {
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content-list {
  display: inline-block;
  padding: 16px 16px 66px;
}
.filters-form {
  padding: 16px 16px 0;
}
.table-list {
  display: inline-block;
}
</style>
