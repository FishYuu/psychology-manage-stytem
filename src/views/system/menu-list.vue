<template>
  <div class="cms-list">
    <div class="filters-form">
      <el-form class="filters" ref="searchForm" :inline="true" size="medium">
        <el-button type="primary" size="medium" @click="optionMsg(null, 0)">新增菜单</el-button>
      </el-form>
    </div>
    <div class="content-list">
      <el-table :data="menusList" ref="elTable" border :stripe="true" header-cell-class-name="my-table-cell">
        <el-table-column prop="funcCode" label="菜单编码" align="center" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column prop="funcName" label="菜单名称" width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="funcUrl" label="菜单路由" width="240" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="funcIcon" label="菜单图标" width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope"
            ><div><i :class="scope.row.funcIcon"></i></div
          ></template>
        </el-table-column>
        <el-table-column prop="funcDesc" label="菜单描述" width="240" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" align="center" width="200">
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
    <gem-pagination :current-page.sync="listFilterForm.pageIndex" :page-size="listFilterForm.pageSize" :total="listTotal" @size-change="onPageSizeChange" @current-change="onCurrentChange"></gem-pagination>
    <!-- 新增菜单 -->
    <el-dialog title="新增菜单" :visible.sync="dialogAddFormVisible" width="560px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form class="custom-form" ref="addFormDetail" :model="addFormDetail" :rules="addFormDetailRule" size="mini">
        <el-form-item label="所属菜单" label-width="120px" prop="funcParent">
          <el-select v-model="addFormDetail.funcParent" placeholder="请选择角色分组" clearable>
            <el-option v-for="item in parentList" :key="item.funcCode" :label="item.funcName" :value="item.funcCode"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单编码" label-width="120px" prop="funcCode">
          <el-input v-model="addFormDetail.funcCode" clearable :disabled="Action === 1" placeholder="例如：01"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" label-width="120px" prop="funcName">
          <el-input v-model="addFormDetail.funcName" clearable></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" label-width="120px" prop="funcIcon">
          <el-input v-model="addFormDetail.funcIcon" clearable></el-input>
        </el-form-item>
        <el-form-item label="菜单路由" label-width="120px" prop="funcUrl">
          <el-input v-model="addFormDetail.funcUrl" clearable></el-input>
        </el-form-item>
        <el-form-item label="菜单描述" label-width="120px" prop="funcDesc">
          <el-input v-model="addFormDetail.funcDesc" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd" size="mini">取 消</el-button>
        <el-button type="primary" @click="sureAddRole" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Api from '@/api/apis'
export default {
  data() {
    return {
      dialogAddFormVisible: false,
      addFormDetail: {
        funcParent: null,
        funcCode: '',
        funcName: '',
        funcIcon: '',
        funcUrl: '',
        funcDesc: '',
        serialNumber: null
      },
      Action: null,
      addFormDetailRule: {
        funcCode: [
          { required: true, message: '请输入菜单编码', trigger: 'blur' },
          { min: 2, max: 4, message: '不得少于两位，多于四位', trigger: 'blur' }
        ],
        funcName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        funcUrl: [{ required: true, message: '请输入菜单路由', trigger: 'blur' }]
      },
      menusList: [],
      parentList: [], // 一级菜单
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
      this._getMenusList()
      this._getParentMenuList()
    },
    // 获取一级菜单
    _getParentMenuList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.queryParentFuncList).then(ret => {
        loading.close()
        this.parentList = ret.list
      })
    },
    // 获取所有菜单
    _getMenusList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.queryFuncPage, { pageNum: this.listFilterForm.pageIndex, pageSize: this.listFilterForm.pageSize }).then(ret => {
        loading.close()
        this.listTotal = ret.total
        this.menusList = ret.list
      })
    },
    sureAddRole() {
      this.$refs.addFormDetail.validate(valid => {
        if (valid) {
          this.addFormDetail.funcParent = this.addFormDetail.funcParent || null
          this.addFormDetail.serialNumber = this.addFormDetail.funcCode
          this.Action === 0 ? this.addMenuOption() : this.editMenuOption()
        }
      })
    },
    // 添加菜单
    addMenuOption() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.addFormDetail.funcCode = this.addFormDetail.funcParent ? `${this.addFormDetail.funcParent}${this.addFormDetail.funcCode}` : this.addFormDetail.funcCode
      this.$http(Api.addFunc, this.addFormDetail).then(ret => {
        loading.close()
        this.$message.success(ret.message)
        this._getMenusList()
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
      this.$http(Api.updateFunc, this.addFormDetail).then(ret => {
        loading.close()
        this.$message.success(ret.message)
        this._getMenusList()
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
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.delFunc, row).then(ret => {
        loading.close()
        this.$message.success(ret.message)
        this._getMenusList()
      })
    },
    cancelAdd() {
      this.$refs.addFormDetail.resetFields()
      this.dialogAddFormVisible = false
    },
    onPageSizeChange(retSize) {
      this.listFilterForm.pageSize = retSize
      this._getMenusList()
    },
    onCurrentChange(current) {
      this.listFilterForm.pageIndex = current
      this._getMenusList()
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
