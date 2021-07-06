<template>
  <div class="cms-list">
    <div class="left-task">
      <el-tree :data="groupRoleList" node-key="id" :props="props" accordion :load="_getContentList" lazy>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span @click="onRoleNodeClick(data, node)">{{ data.label }}</span>
          <span v-if="node.level > 1">
            <el-button type="text" size="mini" @click=";(showGuyModal = true), (addRoleObj = data)">
              新增人员
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <div class="right-task">
      <div class="filters-form">
        <el-form class="filters" ref="searchForm" :inline="true" size="mini">
          <el-form-item label="手机号：">
            <el-input placeholder="输入人员手机号查询"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input placeholder="输入人员手机号查询"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="current-role">当前角色：{{ activeRoleObj ? activeRoleObj.roleName : '' }}</div>
      <div class="content-body">
        <el-table :data="userTableData" stripe style="width: 100%" v-loading="tableDataLoding">
          <el-table-column prop="userName" label="姓名" width="180" align="center"> </el-table-column>
          <el-table-column label="部门名称" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.deptPath" placement="top-start">
                <span>{{ scope.row.deptName }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column label="职务" width="180" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.jobLevel | jobLevelToString }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户类型" width="180" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.userType | userTypeToString }}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="usingMobile" label="手机号" width="180" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="deleteUserRole(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <gem-pagination :current-page.sync="listFilterForm.pageNum" :page-size="listFilterForm.pageSize" :total="listTotal" @size-change="onPageSizeChange" @current-change="onCurrentChange"></gem-pagination>
    </div>
    <gem-guy :show.sync="showGuyModal" @result="sureAddToRole"></gem-guy>
  </div>
</template>
<script>
import Api from '@/api/apis'
import Filter from '@/common/js/Filters'
export default {
  mixins: [Filter],
  data() {
    return {
      showGuyModal: false,
      props: {
        label: 'roleName',
        children: 'list',
        isLeaf: 'leaf'
      },
      roleLists: [], // 左侧角色列表
      groupRoleList: [],
      listTotal: 0, // 右侧主要表单数据预计总数
      userTableData: [], // 根据查询条件所得的列表数据
      listFilterForm: {
        roleCode: '', // 仅仅是查询时的参数roleCode，新增不能用此值
        pageNum: 1,
        pageSize: 10
      },
      activeRoleObj: null,
      addRoleObj: null,
      tableDataLoding: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initData()
    })
  },
  methods: {
    _initData() {
      // this._getContentList()
    },
    _getContentList(node, resolve) {
      if (node.level === 0) {
        this.$http(Api.queryRoleGroupPage, { pageNum: 1, pageSize: 1000000 }).then(ret => {
          return resolve(
            ret.list.map(group => {
              return {
                label: group.roleGroupName,
                roleGroupCode: group.roleGroupCode,
                children: []
              }
            })
          )
        })
      } else if (node.level > 1) {
        resolve([])
      } else {
        let param = {
          roleGroupCode: node.data.roleGroupCode
        }
        this.$http(Api.getRoleList, param).then(ret => {
          return resolve(
            ret.list.map(role => {
              return {
                ...role,
                label: role.roleName,
                roleCode: role.roleCode,
                leaf: true,
              }
            })
          )
        })
      }
    },
    sureAddToRole(retUserArr) {
      if (!this.addRoleObj) {
        this.$message.error('请选择一种角色再添加人员')
        return false
      }
      const param = {
        userRoleList: retUserArr.map(user => {
          return {
            roleCode: this.addRoleObj.roleCode,
            userId: user.userId
          }
        })
      }
      this.$http(Api.addUserRole, param).then(() => {
        this.activeRoleObj = this.addRoleObj
        this.listFilterForm.roleCode = this.addRoleObj.roleCode
        this.queryUsersByFilter()
        this.$message.success('新增人员成功')
      })
    },
    onRoleNodeClick(data, node) {
      if (node.level <= 1) {
        return false
      }
      this.activeRoleObj = data
      this.listFilterForm.roleCode = data.roleCode
      this.queryUsersByFilter()
    },
    queryUsersByFilter() {
      this.tableDataLoding = true
      this.$http(Api.queryUsersByRole, this.listFilterForm).then(ret => {
        this.tableDataLoding = false
        this.listTotal = ret.total
        this.userTableData = ret.userlist
      })
    },
    deleteUserRole(userRole) {
      console.log(userRole)
      this.$confirm('删除该条数据，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '点错了',
        type: 'warning'
      })
        .then(() => {
          this.$http(Api.deleteUserRole, { roleCode: userRole.roleCode, userId: userRole.userId }).then(() => {
            this.$message.success('删除成功！')
            this.queryUsersByFilter()
          })
        })
        .catch(() => {})
    },
    onPageSizeChange(retSize) {
      this.listFilterForm.pageSize = retSize
      this.queryUsersByFilter()
    },
    onCurrentChange(current) {
      this.listFilterForm.pageNum = current
      this.queryUsersByFilter()
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'common/styles/variable.scss';
.cms-list {
  height: 100%;
  display: flex;
  padding: 20px;
  .left-task {
    padding: 8px 0;
    flex: 0 0 300px;
    background-color: #ffffff;
  }
  .right-task {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    background-color: #ffffff;
    padding: 24px 16px;
    position: relative;
    .content-body {
      flex: 1;
      overflow: auto;
    }
  }
}
.current-role {
  font-size: 14px;
  color: $theme-color;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
