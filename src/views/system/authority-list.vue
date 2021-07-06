<template>
  <div class="cms-list">
    <!-- 列表 -->
    <div class="content-list">
      <el-table :data="authorityList" ref="elTable" border :stripe="true" header-cell-class-name="my-table-cell">
        <el-table-column prop="roleCode" label="角色编码" align="center" show-overflow-tooltip width="240"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="240" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="角色有效性" width="240" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | roleStatusToString }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="roleGroupName" label="所属分组" width="240" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.roleGroupCode ? scope.row.roleGroupName : '默认分组（无分组）' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button @click="optionMsg(scope.row)" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <gem-pagination :current-page.sync="listFilterForm.pageIndex" :page-size="listFilterForm.pageSize" :total="listTotal" @size-change="onPageSizeChange" @current-change="onCurrentChange"></gem-pagination>

    <!-- 弹框 -->
    <el-dialog title="配置菜单项" :visible.sync="dialogAddFormVisible" width="760px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-tree :data="menuList" :props="props" ref="menus" show-checkbox node-key="funcCode" :default-checked-keys="selectRow"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="sureAddRole" size="mini">提 交</el-button> 
      </div>
    </el-dialog>
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
      authorityList: [],
      menusList: [],
      dialogAddFormVisible: false,
      listTotal: 0,
      selectRuleCode: '',
      selectRow: [],
      listFilterForm: {
        pageIndex: 1,
        pageSize: 20
      },
      props: {
        id: 'funcCode',
        children: 'children',
        label: 'funcName',
        lazy: true,
        emitPath: false,
        checkStrictly: true
      },
      menuList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this._getAuthorityList()
      this._getMenusList()
    },
    // 获取权限列表
    _getAuthorityList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.getRoleList, { pageNum: this.listFilterForm.pageIndex, pageSize: this.listFilterForm.pageSize }).then(ret => {
        loading.close()
        this.listTotal = ret.total
        this.authorityList = ret.list
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
    // 重构菜单结构
    recursiveMenus(oriArr, parent) {
      if (!parent) {
        this.menuList = oriArr.filter(v => !v.funcParent)
        this.menuList.forEach(menu => {
          this.recursiveMenus(oriArr, menu)
        })
      } else {
        if (oriArr.filter(v => v.funcParent === parent.funcCode) && oriArr.filter(v => v.funcParent === parent.funcCode).length > 0) {
          parent.children = oriArr.filter(v => v.funcParent === parent.funcCode)
          parent.children.forEach(subMenu => {
            this.recursiveMenus(oriArr, subMenu)
          })
        }
      }
    },
    // 编辑角色权限
    optionMsg(row) {
      this.dialogAddFormVisible = true
      this.selectRuleCode = row.roleCode
      this._getRoleAuthorityList()
    },
    // 获取角色权限信息
    _getRoleAuthorityList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      let paramas = {
        roleCode: this.selectRuleCode,
        pageNum: 1,
        pageSize: 100
      }
      this.$http(Api.queryFuncRolePage, paramas).then(ret => {
        loading.close()
        let selectList = ret.list.map(item => {
          return item.funcCode
        })
        // 设置角色默认选中的菜单
        this.$refs.menus.setCheckedKeys(selectList)
      })
    },
    // 确认修改角色权限
    sureAddRole() {
      // 获取选中的数据
      let lastSelectList = this.$refs.menus
        .getCheckedKeys()
        .concat(this.$refs.menus.getHalfCheckedKeys())
        .map(item => {
          return {
            roleCode: this.selectRuleCode,
            funcCode: item
          }
        })
      if (lastSelectList.length === 0) {
        this.$message.warning('请选择菜单！')
        return false
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      this.$http(Api.addFuncRoleList, JSON.stringify(lastSelectList)).then(ret => {
        loading.close()
        this.$message.success('修改成功！')
        this.dialogAddFormVisible = false
      })
    },
    onPageSizeChange(retSize) {
      this.listFilterForm.pageSize = retSize
      this._getAuthorityList()
    },
    onCurrentChange(current) {
      this.listFilterForm.pageIndex = current
      this._getAuthorityList()
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
