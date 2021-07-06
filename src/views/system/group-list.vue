<template>
  <div class="cms-list">
    <el-alert title="删除警告" type="warning" description="非管理人员请勿随意删除分组信息，可能会导致不可预知的错误。" show-icon> </el-alert>
    <div class="filters-form">
      <el-form class="filters" ref="searchForm" :inline="true" size="medium">
        <!-- <el-form-item label="标题：">
          <el-input placeholder="输入标题查询"></el-input>
        </el-form-item>
        <el-form-item label="分类：">
          <el-cascader :options="allCategoryList" :props="{ checkStrictly: true }" clearable></el-cascader>
        </el-form-item> -->
        <el-button type="primary" size="medium" @click="dialogAddFormVisible = true">新增分组</el-button>
      </el-form>
    </div>
    <div class="content-list">
      <el-table :data="roleLists" ref="elTable" border :stripe="true" header-cell-class-name="my-table-cell">
        <el-table-column prop="roleGroupCode" label="分组编码" align="center" show-overflow-tooltip width="240">
        </el-table-column>
        <el-table-column prop="roleGroupName" label="分组名称" width="240" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
              <el-button @click="handleRowClick(scope.row)" icon="el-icon-search" circle size="mini" title="查看">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button @click="handleRowClickEdit(scope.row)" type="primary" icon="el-icon-edit" circle size="mini">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="onDeleteOpeation(scope.row)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <gem-pagination :current-page.sync="listFilterForm.pageIndex" :page-size="listFilterForm.pageSize"
      :total="listTotal" @size-change="onPageSizeChange" @current-change="onCurrentChange"></gem-pagination>
    <el-dialog title="新增分组" :visible.sync="dialogAddFormVisible" width="560px" :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false">
      <el-form class="custom-form" ref="addFormDetail" :model="addFormDetail" :rules="addFormDetailRule" size="mini">
        <el-form-item label="分组编码" label-width="120px" prop="roleGroupCode">
          <el-input v-model="addFormDetail.roleGroupCode" clearable></el-input>
        </el-form-item>
        <el-form-item label="分组名称" label-width="120px" prop="roleGroupName">
          <el-input v-model="addFormDetail.roleGroupName" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd" size="mini">取 消</el-button>
        <el-button type="primary" @click="sureAddRole" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑分组" :visible.sync="dialogEditFormVisible" width="560px" :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false">
      <el-form class="custom-form" ref="editFormDetail" :model="editFormDetail" :rules="addFormDetailRule" size="mini">
        <el-form-item label="分组编码" label-width="120px" prop="roleGroupCode">
          <el-input v-model="editFormDetail.roleGroupCode" clearable></el-input>
        </el-form-item>
        <el-form-item label="分组名称" label-width="120px" prop="roleGroupName">
          <el-input v-model="editFormDetail.roleGroupName" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit" size="mini">取 消</el-button>
        <el-button type="primary" @click="sureEditRole" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看分组" :visible.sync="dialogViewFormVisible" width="560px" :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false">
      <el-form class="custom-form" size="mini">
        <el-form-item label="分组编码：" label-width="120px" prop="roleGroupCode">{{ viewFormDetail.roleGroupCode }}
        </el-form-item>
        <el-form-item label="分组名称：" label-width="120px" prop="roleGroupName">{{ viewFormDetail.roleGroupName }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogViewFormVisible = false" size="mini">确 定</el-button>
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
        dialogAddFormVisible: false,
        dialogEditFormVisible: false,
        dialogViewFormVisible: false,
        addFormDetail: {
          roleGroupCode: '',
          roleGroupName: ''
        },
        editFormDetail: {
          id: '',
          roleGroupCode: '',
          roleGroupName: ''
        },
        viewFormDetail: {
          id: '',
          roleGroupCode: '',
          roleGroupName: ''
        },
        addFormDetailRule: {
          roleGroupCode: [{
            required: true,
            message: '请输入分组编码',
            trigger: 'blur'
          }],
          roleGroupName: [{
            required: true,
            message: '请输入分组名称',
            trigger: 'blur'
          }]
        },
        roleLists: [],
        listTotal: 0,
        listFilterForm: {
          pageIndex: 1,
          pageSize: 20
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this._initData()
      })
    },
    methods: {
      _initData() {
        this._getContentList()
      },
      _getContentList() {
        const loading = this.$loading({
          lock: true,
          text: '加载中...',
          background: 'rgba(255, 255, 255, 0.5)'
        })
        this.$http(Api.queryRoleGroupPage, {
          pageNum: this.listFilterForm.pageIndex,
          pageSize: this.listFilterForm.pageSize
        }).then(ret => {
          loading.close()
          this.listTotal = ret.total
          this.roleLists = ret.list
        })
      },
      sureAddRole() {
        this.$refs.addFormDetail.validate(valid => {
          if (valid) {
            this.$http(Api.addRoleGroup, {
              roleGroupCode: this.addFormDetail.roleGroupCode,
              roleGroupName: this.addFormDetail.roleGroupName
            }).then(ret => {
              this.dialogAddFormVisible = false
              this.$refs.addFormDetail.resetFields()
              this._getContentList()
            })
          }
        })
      },
      sureEditRole() {
        this.$refs.editFormDetail.validate(valid => {
          if (valid) {
            this.$http(Api.updateRoleGroup, {
              id: this.editFormDetail.id,
              roleGroupCode: this.editFormDetail.roleGroupCode,
              roleGroupName: this.editFormDetail.roleGroupName
            }).then(ret => {
              this.dialogEditFormVisible = false
              this.$refs.editFormDetail.resetFields()
              this._getContentList()
            })
          }
        })
      },
      cancelAdd() {
        this.$refs.addFormDetail.resetFields()
        this.dialogAddFormVisible = false
      },
      cancelEdit() {
        this.$refs.editFormDetail.resetFields()
        this.dialogEditFormVisible = false
      },
      handleRowClick({
        id,
        roleGroupCode,
        roleGroupName
      }) {
        this.viewFormDetail.id = id
        this.viewFormDetail.roleGroupCode = roleGroupCode
        this.viewFormDetail.roleGroupName = roleGroupName
        this.dialogViewFormVisible = true
      },
      handleRowClickEdit({
        id,
        roleGroupCode,
        roleGroupName
      }) {
        this.editFormDetail.id = id
        this.editFormDetail.roleGroupCode = roleGroupCode
        this.editFormDetail.roleGroupName = roleGroupName
        this.dialogEditFormVisible = true
      },
      onDeleteOpeation(row) {
        this.$confirm('删除该条数据，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '点错了',
            type: 'warning'
          })
          .then(() => {
            this.$http(Api.delRoleGroupById, {
              roleId: row.id
            }).then(() => {
              this.$message.success('删除成功！')
              this._getContentList()
            })
          })
          .catch(() => {})
      },
      onPageSizeChange(retSize) {
        this.listFilterForm.pageSize = retSize
        this._getContentList()
      },
      onCurrentChange(current) {
        this.listFilterForm.pageIndex = current
        this._getContentList()
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