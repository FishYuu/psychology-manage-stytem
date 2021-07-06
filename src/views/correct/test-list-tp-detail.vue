<template>
  <div class="cms-list">
    <div class="termer-detail" v-if="termerDetail">
      <el-form label-width="80" size="small">
        <el-row>
          <el-col :span="4">
            <el-form-item label="姓名">
              {{ termerDetail.userName }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="性别">
              {{ termerDetail.gender }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="身份号">
              {{ termerDetail.idCard }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="归属单位">
              {{ termerDetail.deptName }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="手机号">
              {{ termerDetail.usingMobile }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <p class="test-title">量表概况</p>
    <div class="test-summary" v-if="testDetail && testDetail.resultStandard">
      <el-form label-width="80" size="small">
        <el-row>
          <el-col>
            <el-form-item label="量表得分：">
              {{ testDetail.totalScore }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="量表总结：">
              {{ testDetail.resultStandard.resultExplain }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="group-container" v-if="testDetail">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane :label="group.assessmentGroupName" :name="group.assessmentGroupId" v-for="group in testDetail.groupList" :key="group.assessmentGroupId">
          <div class="test-summary" v-if="group.resultGroupStandard">
            <el-form label-width="80" size="small">
              <el-row>
                <el-col>
                  <el-form-item label="分组得分：">
                    {{ group.totalScore }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="分组总结：">
                    {{ group.resultGroupStandard.resultExplain }}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="test-subject-container" v-for="activeSubject in group.subjectList" :key="activeSubject.assessmentSubjectId">
            <div class="subject-type">{{ activeSubject.subjectType | subjectType2String }}</div>
            <div class="subject-item-container">
              <div class="subject-item-title">{{ activeSubject.subjectNo }}：{{ activeSubject.assessmentSubjectName }}</div>
              <template v-if="activeSubject.subjectType === 'EC'">
                <div class="subject-item-options" :label="activeSubject.selectOptionId">
                  <div class="subject-item-options-value" v-for="option in activeSubject.optionList" :key="option.testOptionId">
                    <el-radio v-model="activeSubject.selectOptionId" :label="option.testOptionId">（{{ option.score }}分）{{ option.optionContent }}</el-radio>
                  </div>
                </div>
              </template>
              <template v-if="activeSubject.subjectType === 'FTB'">
                <div class="subject-item-options">
                  <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="activeSubject.remark"> </el-input>
                </div>
              </template>
              <template v-if="activeSubject.subjectType === 'MC'">
                <div class="subject-item-options">
                  <el-checkbox-group v-model="activeSubject.selectOptionIds">
                    <el-checkbox :label="option.testOptionId" v-for="option in activeSubject.optionList" :key="option.testOptionId">（{{ option.score }}分）{{ option.optionContent }}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </template>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="btn-container">
        <el-button type="primary" size="small" @click="submitData">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '@/api/apis'
import Filter from '@/common/js/Filters'
export default {
  mixins: [Filter],
  data() {
    return {
      termerDetail: null,
      testDetail: null,
      activeTab: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.queryUser()
      this.queryTestDetail()
    },
    queryUser() {
      this.$http(Api.queryUserPage, { userId: this.$route.query.termerId }).then(
        ret => {
          if (ret.userList.length <= 0) {
            this.$router.back(-1)
            return false
          }
          this.termerDetail = ret.userList[0]
        },
        () => {
          this.$router.back(-1)
        }
      )
    },
    queryTestDetail() {
      this.$http(Api.queryTestByTestId, { testId: this.$route.query.testId, assessmentType: 'TP' }).then(
        ret => {
          this.testDetail = ret.test
          this.testDetail.groupList.forEach(group => {
            group.subjectList.forEach(subject => {
              if (subject.subjectType === 'MC') {
                this.$set(subject, 'selectOptionIds', subject.selectOptionId ? subject.selectOptionId.split(',') : [])
              }
              if (subject.subjectType === 'EC') {
                this.$set(subject, 'selectOptionId', subject.selectOptionId ? subject.selectOptionId : '')
              }
            })
          })
          this.activeTab = this.testDetail.groupList[0].assessmentGroupId
        },
        () => {
          this.$router.back(-1)
        }
      )
    },
    formedSubmitData() {
      let notAnswerQuestionLen = 0
      let ret = this.testDetail.groupList.reduce((pre, group) => {
        return [
          ...pre,
          ...group.subjectList.map(subject => {
            if (subject.subjectType === 'FTB') {
              if (!subject.remark) {
                notAnswerQuestionLen++
              }
              return {
                remark: subject.remark,
                testSubjectId: subject.assessmentSubjectId,
                updateId: JSON.parse(sessionStorage.getItem('loginUser')).userId,
                userId: JSON.parse(sessionStorage.getItem('loginUser')).userId,
                userName: JSON.parse(sessionStorage.getItem('loginUser')).userName
              }
            }
            if (subject.subjectType === 'EC') {
              if (!subject.selectOptionId) {
                notAnswerQuestionLen++
              }
              return {
                remark: subject.remark,
                selectOptionId: subject.selectOptionId,
                score: subject.optionList.find(p => p.testOptionId === subject.selectOptionId).score,
                testSubjectId: subject.assessmentSubjectId,
                updateId: JSON.parse(sessionStorage.getItem('loginUser')).userId,
                userId: JSON.parse(sessionStorage.getItem('loginUser')).userId,
                userName: JSON.parse(sessionStorage.getItem('loginUser')).userName
              }
            }
            if (subject.subjectType === 'MC') {
              if (subject.selectOptionIds.length <= 0) {
                notAnswerQuestionLen++
              }
              return {
                remark: subject.remark,
                score: subject.optionList
                  .filter(p => {
                    return subject.selectOptionIds.includes(p.testOptionId)
                  })
                  .reduce((pre, cur) => {
                    return pre + cur.score
                  }, 0),
                selectOptionId: subject.selectOptionIds.join(','),
                testSubjectId: subject.assessmentSubjectId,
                updateId: JSON.parse(sessionStorage.getItem('loginUser')).userId,
                userId: JSON.parse(sessionStorage.getItem('loginUser')).userId,
                userName: JSON.parse(sessionStorage.getItem('loginUser')).userName
              }
            }
          })
        ]
      }, [])
      if (notAnswerQuestionLen) {
        this.$message({
          message: '请将题目回答完整！',
          type: 'warning'
        })
        return false
      }
      return ret
    },
    submitData() {
      if (this.formedSubmitData()) {
        let param = {
          testId: this.$route.query.testId,
          subjectList: this.formedSubmitData(),
          updateId: JSON.parse(sessionStorage.getItem('loginUser')).userId
        }
        this.$http(Api.submitTest, param).then(() => {
          this.$message({
            message: '提交成功！',
            type: 'success',
            onClose: () => {
              this.$router.back(-1)
            }
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.cms-list {
  padding: 16px;
}
.termer-detail {
  background-color: #ffffff;
  padding: 16px 16px 0;
  box-shadow: 0 0 5px #eeeeee;
}
.test-summary {
  background-color: #ffffff;
  padding: 16px 16px 0;
  box-shadow: 0 0 5px #eeeeee;
  margin-bottom: 16px;
}
.test-title {
  font-size: 18px;
  font-weight: bold;
  margin: 16px 0;
}
.el-checkbox {
  display: block;
  margin-top: 16px;
}
.subject-item-options-value {
  margin-top: 16px;
}
.test-subject-container {
  .subject-type {
    border-bottom: 1px solid #dddddd;
    padding-bottom: 16px;
  }
  & + .test-subject-container {
    .subject-type {
      padding-top: 16px;
    }
  }
}

.subject-item-title {
  margin: 16px 0;
}

.btn-container {
  padding: 16px;
  text-align: center;
}
</style>
