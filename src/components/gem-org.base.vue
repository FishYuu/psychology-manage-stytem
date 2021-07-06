<template>
  <transition name="el-fade-in">
    <div class="gem-modal-wrapper" v-show="show">
      <div class="gem-guy-box">
        <span class="close-btn" @click="close">
          <i class="el-icon-close"></i>
        </span>
        <div class="gem-guy-header">
          <span class="header-title">选择单位</span>
        </div>
        <div class="gem-guy-body">
          <!-- <div class="filter-container">
            <el-select v-model="selectValue" filterable remote placeholder="输入姓名或手机号搜索" :remote-method="remoteMethod" :loading="remoteLoading" @change="onSelectChange" size="mini">
              <el-option v-for="item in optionsData" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </div> -->
          <div class="select-body">
            <div class="select-tree-body">
              <el-tree :props="treeProps" :data="treeData" @node-click="selectOne" :expand-on-click-node="false"></el-tree>
            </div>
            <div class="selected-tree-body">
              <span class="selected-title">已选列表</span>
              <div class="selected-container" v-show="haveSelectedData">
                <el-tag v-for="tag in selectedListData" :key="tag.orgId" closable size="medium" @close="deleteFromSelected(tag)">
                  {{ tag.orgName }}
                </el-tag>
              </div>
              <div class="selected-empty" v-show="!haveSelectedData">未选择任何单位</div>
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
const optionData = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
]
export default {
  name: 'gemOrg',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    deptId: {
      type: String,
      default: JSON.parse(window.sessionStorage.getItem('loginUser')) ? JSON.parse(window.sessionStorage.getItem('loginUser')).deptId : ''
    },
    orgCode: {
      type: String,
      default: JSON.parse(window.sessionStorage.getItem('loginUser')) ? JSON.parse(window.sessionStorage.getItem('loginUser')).orgCode : ''
    },
    deptFlag: {
      type: String,
      default: '0'
    },
    userFlag: {
      type: String,
      default: '0'
    },
    orgFlag: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      treeProps: {
        label: 'orgName',
        children: 'nodes',
        isLeaf: 'leaf'
      },
      treeData: [],
      optionsData: [],
      dataList: [],
      remoteLoading: false,
      selectValue: '',
      selectedListData: []
    }
  },
  mounted() {
    this.queryOrgs()
    this.$nextTick(() => {
      this.dataList = optionData.map(item => {
        return { value: `value:${item}`, label: `label:${item}`, phone: '15868996522' }
      })
    })
  },
  computed: {
    haveSelectedData() {
      return this.selectedListData.length > 0
    }
  },
  methods: {
    queryOrgs() {
      let param = {
        deptFlag: this.deptFlag,
        deptId: this.deptId,
        orgCode: this.orgCode,
        orgFlag: this.orgFlag,
        userFlag: this.userFlag
      }
      this.$http(Api.queryDept, param).then(ret => {
        this.treeData = ret.orgTree
          ? [ret.orgTree].map(org => {
              return {
                leaf: !!org.nodes,
                ...org
              }
            })
          : []
      })
    },
    close() {
      this.selectedListData = []
      this.$emit('update:show', false)
    },
    remoteMethod(query) {
      if (query !== '') {
        this.remoteLoading = true
        setTimeout(() => {
          this.remoteLoading = false
          this.optionsData = this.dataList.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.optionsData = []
      }
    },
    onSelectChange(ret) {
      console.log(ret)
      this.selectValue = ''
    },
    selectOne(data) {
      if (this.selectedListData.findIndex(v => v.orgId === data.orgId) === -1) {
        this.selectedListData.push(data)
      } else {
        this.$message({ message: '已选择此条信息，请勿重复选择', type: 'error', duration: 1000 })
      }
    },
    deleteFromSelected(data) {
      this.selectedListData.splice(
        this.selectedListData.findIndex(v => v.orgId === data.orgId),
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
