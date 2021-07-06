<template>
  <div class="cms-list">
    <div class="filters-form">
      <el-form class="filters" ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item label="人员状态" prop="labelType">
          <el-select v-model="searchForm.termerStatus" placeholder="请选择人员状态" clearable>
            <el-option v-for="item in termerStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员姓名" prop="labelType">
          <el-input v-model="searchForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="矫正编号" prop="sqjzrybh">
          <el-input v-model="searchForm.sqjzrybh" clearable></el-input>
        </el-form-item>
        <el-form-item label="矫正开始日期(区间)" prop="labelType">
          <el-date-picker v-model="timeFrame" clearable type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
         <el-form-item label="矫正结束日期(区间)" prop="labelType">
          <el-date-picker v-model="endTimeFrame" clearable type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-button type="primary" size="medium" @click="_searchList">搜索</el-button>
        <el-button type="warning" size="medium" @click="pagesShow = true" :disabled="selectRow.length === 0">发试卷</el-button>
      </el-form>
    </div>
    <div class="content-list">
      <el-table :data="termerInfoList" ref="termerInfoList" border :stripe="true" header-cell-class-name="my-table-cell" @selection-change="selectTemer">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="人员姓名" align="center" show-overflow-tooltip width="240"></el-table-column>
        <el-table-column prop="sqjzrybh" label="矫正编号" align="center" show-overflow-tooltip width="120"></el-table-column>
        <!-- <el-table-column prop="national" label="民族" width="100" align="center" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="orgName" label="所属单位" width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="termerStatus" label="人员状态" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.termerStatus | termerStatusString }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="charges" label="罪名" width="120" align="center" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="ccStartTime" label="入矫时间" width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.ccStartTime | dateFormat('yyyy-mm-dd HH:MM:SS') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ccEndTime" label="解矫时间" width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.ccEndTime | dateFormat('yyyy-mm-dd HH:MM:SS') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="managementLevel" label="管理等级" width="120" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <gem-pagination :current-page.sync="listFilterForm.pageIndex" :page-size="listFilterForm.pageSize" :total="listTotal" @size-change="onPageSizeChange" @current-change="onCurrentChange"></gem-pagination>
    <!-- 量表信息 -->
    <el-dialog title="量表信息" :visible.sync="pagesShow" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form class="filters" ref="searchstageForm" :model="searchstageForm" :inline="true" size="medium">
        <el-form-item prop="labelType">
          <el-select v-model="searchstageForm.phaseId" placeholder="请选择阶段">
            <el-option v-for="item in stageList" :key="item.phaseId" :label="item.phaseName" :value="item.phaseId"> </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" size="medium" @click="_searchstageList">搜索</el-button>
      </el-form>
      <el-table :data="assessementList" ref="assessementList" border :stripe="true" header-cell-class-name="my-table-cell" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="assessmentName" label="表名" width="240" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="有效性" width="240" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | roleStatusToString }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="240" align="center" show-overflow-tooltip> </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAssess" size="mini">关 闭</el-button>
        <el-button @click="_optionPages" :disabled="selectAssessmentList.length === 0" type="primary" size="mini">确 认</el-button>
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
      colorDialog: false,
      dialogAddFormVisible: false,
      searchForm: {
        termerStatus: '',
        name: '',
        sqjzrybh: ''
      },
      searchstageForm: {
        phaseId: ''
      },
      timeFrame: '',
      endTimeFrame: '',
      termerStatusList: [
        { label: '解矫', value: 0 },
        { label: '在册', value: 1 },
        { label: '待接收', value: 2 },
        { label: '未按时报到', value: 3 },
        { label: '矫正中止', value: 4 }
      ],
      termerInfoList: [],
      pagesShow: false,
      selectRow: [],
      stageList: [],
      selectAssessmentList: [],
      assessementList: [],
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
      this._getPersonList()
      this._getStageList()
      this._departList()
    },
    _searchstageList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.queryAssessmentPhasePage, { phaseId: this.searchstageForm.phaseId }).then(ret => {
        loading.close()
        this.listTotal = ret.total
        this.assessementList = ret.assessmentList
      })
    },
    _departList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.queryOrgTree, {orgCode: '420000020101011514'}).then(ret => {
        loading.close()
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
    _getPersonList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      let params = {
        ...this.searchForm,
        ccStartTimeBegin: this.timeFrame ? `${this.timeFrame[0]} 00:00:00` : '',
        ccStartTimeEnd: this.timeFrame ? `${this.timeFrame[1]} 23:59:59` : '',
        ccEndTimeBegin: this.endTimeFrame ? `${this.endTimeFrame[0]} 00:00:00` : '',
        ccEndTimeEnd: this.endTimeFrame ? `${this.endTimeFrame[1]} 23:59:59` : '',
        pageNum: this.listFilterForm.pageIndex,
        pageSize: this.listFilterForm.pageSize
      }
      this.$http(Api.queryTermerInfoPage, params).then(ret => {
        loading.close()
        this.listTotal = ret.total
        this.termerInfoList = ret.termerInfoList
      })
    },
    closeAssess() {
      this.pagesShow = false
      this.selectAssessmentList = []
      this.selectRow = []
      this.$refs.assessementList.clearSelection()
      this.$refs.termerInfoList.clearSelection()
    },
    selectTemer(val) {
      this.selectRow = val
    },
    handleSelectionChange(val) {
      this.selectAssessmentList = val
    },
    _optionPages() {
      let _list = []
      this.selectRow.map(item => {
        this.selectAssessmentList.map(assessItem => {
          _list.push({
            assessmentId: assessItem.assessmentId,
            assessmentName: assessItem.assessmentName,
            termerId: item.termerId,
            termerName: item.name
          })
        })
      })
      console.log(_list)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.addTestList, JSON.stringify(_list)).then(ret => {
        loading.close()
        this.$message.success(ret.message)
        this.closeAssess()
      })
    },
    _searchList() {
      this.listFilterForm.pageIndex = 1
      this._getPersonList()
    },
    onPageSizeChange(retSize) {
      this.listFilterForm.pageSize = retSize
      this._getPersonList()
    },
    onCurrentChange(current) {
      this.listFilterForm.pageIndex = current
      this._getPersonList()
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
.search-btns {
  margin-left: 30px;
}
.color-list {
  margin-top: 30px;
}
</style>
