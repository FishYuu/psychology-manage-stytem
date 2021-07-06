<template>
  <transition name="el-fade-in">
    <div class="gem-modal-wrapper" v-show="show">
      <div class="gem-guy-box">
        <span class="close-btn" @click="close">
          <i class="el-icon-close"></i>
        </span>
        <div class="gem-guy-header">
          <span class="header-title">选人</span>
        </div>
        <div class="gem-guy-body">
          <div class="select-body">
            <div class="select-tree-body">
              <el-tree :props="treeProps" :load="loadNode" lazy>
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span class="gem-tree-label" @click="selectOne(data)" v-if="data.gemType === 'user'"
                    >{{ node.label }}<small v-if="data.usingMobile">（{{ data.usingMobile }}）</small></span
                  >
                  <span class="gem-tree-label" v-else>{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
            <div class="selected-tree-body">
              <span class="selected-title">已选列表</span>
              <div class="selected-container" v-show="haveSelectedData">
                <el-tag v-for="tag in selectedListData" :key="tag.id" closable size="medium" @close="deleteFromSelected(tag)">
                  {{ tag.userName }}
                </el-tag>
              </div>
              <div class="selected-empty" v-show="!haveSelectedData">未选择任何人员</div>
            </div>
          </div>
        </div>
        <div class="gem-guy-footer">
          <el-button size="mini" @click="close">取 消</el-button>
          <el-button type="primary" size="mini" :disabled="!haveSelectedData" @click="triggleResult">确 定</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Api from '@/api/apis'
export default {
  name: 'gemRoleGuy',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    taskTypeCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      treeProps: {
        label: 'gemName',
        children: 'gemZones',
        isLeaf: 'leaf'
      },
      optionsData: [],
      remoteLoading: false,
      selectValue: '',
      selectedListData: []
    }
  },
  mounted() {
    this.queryDepts()
  },
  computed: {
    haveSelectedData() {
      return this.selectedListData.length > 0
    }
  },
  methods: {
    queryDepts() {},
    close() {
      this.selectedListData = []
      this.$emit('update:show', false)
    },
    remoteMethod(query) {
      if (query !== '') {
        this.remoteLoading = true
        this.$http(Api.queryUserList, { searchValue: query }).then(ret => {
          this.optionsData = ret.userList
          this.remoteLoading = false
        })
      } else {
        this.optionsData = []
      }
    },
    onSelectChange(ret) {
      let data = this.optionsData.find(v => v.id === ret)
      if (this.selectedListData.findIndex(v => v.id === data.id) === -1) {
        this.selectedListData.push(data)
      } else {
        this.$message({ message: '已选择此条信息，请勿重复选择', type: 'error', duration: 1000 })
      }
      this.selectValue = ''
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.$http(Api.queryRoleByTypeCode, { taskTypeCode: this.taskTypeCode }).then(ret => {
          resolve(
            ret.roleList.map(role => {
              return {
                gemName: role.roleName,
                gemType: 'dept',
                ...role
              }
            })
          )
        })
      } else if (node.level === 1) {
        let param = {
          roleCode: node.data.roleCode,
          taskTypeCode: this.taskTypeCode //必填
        }
        this.$http(Api.queryUserListByCode, param).then(ret => {
          resolve(
            ret.userList.map(user => {
              return {
                gemName: user.userName,
                gemType: 'user',
                leaf: true,
                ...user
              }
            })
          )
        })
      }
    },
    selectOne(data) {
      if (this.selectedListData.findIndex(v => v.id === data.id) === -1) {
        this.selectedListData.push(data)
      } else {
        this.$message({ message: '已选择此条信息，请勿重复选择', type: 'error', duration: 1000 })
      }
    },
    deleteFromSelected(data) {
      this.selectedListData.splice(
        this.selectedListData.findIndex(v => v.id === data.id),
        1
      )
    },
    triggleResult() {
      this.$emit('result', JSON.parse(JSON.stringify(this.selectedListData)))
      this.close()
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'common/styles/variable.scss';
.gem-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1999;
  .gem-guy-box {
    position: absolute;
    width: 660px;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    .close-btn {
      position: absolute;
      right: 20px;
      top: 20px;
      padding: 0;
      background: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 18px;
    }
    .gem-guy-header {
      padding: 20px 20px 10px;
    }
    .gem-guy-body {
      padding: 16px 20px;
    }
    .gem-guy-footer {
      padding: 20px;
      text-align: center;
    }
  }
}
.select-body {
  margin-top: 20px;
  display: flex;
  .select-tree-body {
    width: 50%;
    height: 280px;
    overflow: auto;
  }
  .selected-tree-body {
    flex: 1;
    margin-left: 10px;
    height: 280px;
    overflow: auto;
    position: relative;
    .selected-title {
      margin-left: 10px;
    }
    .selected-container {
      margin-top: 20px;
      .el-tag {
        margin-left: 10px;
        margin-bottom: 10px;
      }
    }
    .selected-empty {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      color: #aaaaaa;
    }
  }
}
.gem-tree-label {
  font-size: 14px;
  display: flex;
  align-items: center;
  small {
    color: #aaaaaa;
  }
}
</style>
