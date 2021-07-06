<template>
  <div class="cms-list">
    <div class="filters-form">
      <el-form class="filters" ref="searchForm" :inline="true" size="medium">
        <el-form-item label="所属单位：">
          <el-input v-model="searchForm.a" placeholder="输入所属单位"></el-input>
        </el-form-item>
        <el-form-item label="人员状态：">
          <el-input v-model="searchForm.b" placeholder="输入标题查询"></el-input>
        </el-form-item>
        <el-form-item label="矫正编号：">
          <el-input v-model="searchForm.c" placeholder="输入矫正编号"></el-input>
        </el-form-item>
        <el-form-item label="人员姓名：">
          <el-input v-model="searchForm.d" placeholder="输入人员姓名"></el-input>
        </el-form-item>
        <el-form-item label="矫正开始日期：">
          <el-date-picker v-model="searchForm.e" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item label="矫正结束日期：">
          <el-date-picker v-model="searchForm.f" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="分类：">
          <el-cascader :options="allCategoryList" :props="{ checkStrictly: true }" clearable></el-cascader>
        </el-form-item> -->
        <el-button type="primary" size="medium">查询</el-button>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="content-list">
      <el-table :data="testList" ref="elTable" border :stripe="true" header-cell-class-name="my-table-cell">
        <el-table-column prop="termerName" label="人员姓名" align="center" show-overflow-tooltip width="240"> </el-table-column>
        <el-table-column prop="assessmentName" label="量表名称" width="240" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="评估状态" width="240" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.assessStatus | assessStatus2String }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="roleGroupName" label="所属分组" width="240" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.roleGroupCode ? scope.row.roleGroupName : '默认分组（无分组）' }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看详细" placement="top-start">
              <el-button @click="goDetail(scope.row)" type="primary" icon="el-icon-search" circle size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <gem-pagination :current-page.sync="listFilterForm.pageIndex" :page-size="listFilterForm.pageSize" :total="listTotal" @size-change="onPageSizeChange" @current-change="onCurrentChange"></gem-pagination>
  </div>
</template>
<script>
import Api from '@/api/apis'
import Filter from '@/common/js/Filters'
import { mapGetters } from 'vuex'
export default {
  mixins: [Filter],
  data() {
    return {
      listFilterForm: {
        pageIndex: 1,
        pageSize: 20
      },
      searchForm: {
        a: '',
        b: '',
        c: '',
        d: '',
        e: [],
        f: []
      },
      listTotal: 0,
      testList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this._getList()
    },
    // 获取权限列表
    _getList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.queryTestPage, { pageNum: this.listFilterForm.pageIndex, pageSize: this.listFilterForm.pageSize, testStatus: 'JS' }).then(ret => {
        loading.close()
        this.listTotal = ret.total
        this.testList = ret.testList
      })
    },
    // 获取所有菜单
    _getMenusList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.queryFuncPage, { pageNum: 1, pageSize: 100 }).then(ret => {
        loading.close()
        this.listTotal = ret.total
        ret.total === 0 ? (this.menuList = []) : this.recursiveMenus(ret.list)
      })
    },
    goDetail(test) {
      console.log(test)
      this.$router.push({
        name: 'test-list-zp-detail',
        query: {
          termerId: test.termerId,
          testId: test.testId
        }
      })
    },
    onPageSizeChange(retSize) {
      this.listFilterForm.pageSize = retSize
      this._getList()
    },
    onCurrentChange(current) {
      this.listFilterForm.pageIndex = current
      this._getList()
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
</style>
