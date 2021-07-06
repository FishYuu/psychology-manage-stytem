const assessment = {
  // 矫正测评指标表
  addAssessmentStandard: {
    url: '/assessmentStandardService/addAssessmentStandard',
    method: 'post'
  },
  addAssessmentStandardList: {
    url: '/assessmentStandardService/addAssessmentStandardList',
    method: 'post'
  },
  delAssessmentStandard: {
    url: '/assessmentStandardService/delAssessmentStandard',
    method: 'post'
  },
  queryAssessmentStandardList: {
    url: '/assessmentStandardService/queryAssessmentStandardList',
    method: 'post'
  },
  updateAssessmentStandard: {
    url: '/assessmentStandardService/updateAssessmentStandard',
    method: 'post'
  },
  // 量表
  addAssessment: {
    url: '/assessmentService/addAssessment',
    method: 'post'
  },
  delAssessment: {
    url: '/assessmentService/delAssessment',
    method: 'post'
  },
  queryAssessmentPage: {
    url: '/assessmentService/queryAssessmentPage',
    method: 'post'
  },
  updateAssessment: {
    url: '/assessmentService/updateAssessment',
    method: 'post'
  },
  queryAssessmentById: {
    url: '/assessmentService/queryAssessmentById',
    method: 'post'
  },
  addAssessmentObj: {
    url: '/assessmentService/addAssessmentObj',
    method: 'post'
  },
  // 选项表
  addAssessmentOption: {
    url: '/assessmentOptionService/addAssessmentOption',
    method: 'post'
  },
  addAssessmentOptionList: {
    url: '/assessmentOptionService/addAssessmentOptionList',
    method: 'post'
  },
  delAssessmentOption: {
    url: '/assessmentOptionService/delAssessmentOption',
    method: 'post'
  },
  queryAssessmentOptionList: {
    url: '/assessmentOptionService/queryAssessmentOptionList',
    method: 'post'
  },
  updateAssessmentOption: {
    url: '/assessmentOptionService/updateAssessmentOption',
    method: 'post'
  },
  // 题库
  addAssessmentSubject: {
    url: '/assessmentSubjectService/addAssessmentSubject',
    method: 'post'
  },
  addAssessmentSubjectList: {
    url: '/assessmentSubjectService/addAssessmentSubjectList',
    method: 'post'
  },
  delAssessmentSubject: {
    url: '/assessmentSubjectService/delAssessmentSubject',
    method: 'post'
  },
  queryAssessmentSubjectPage: {
    url: '/assessmentSubjectService/queryAssessmentSubjectPage',
    method: 'post'
  },
  updateAssessmentSubject: {
    url: '/assessmentSubjectService/updateAssessmentSubject',
    method: 'post'
  },
  addAssessmentSubjectAndOptions: {
    url: '/assessmentSubjectService/addAssessmentSubjectAndOptions',
    method: 'post'
  },
  addAssessmentSubjectAndOptionsList: {
    url: '/assessmentSubjectService/addAssessmentSubjectAndOptionsList',
    method: 'post'
  },
  updateAssessmentSubjectAndOptions: {
    url: '/assessmentSubjectService/updateAssessmentSubjectAndOptions',
    method: 'post'
  },
  // 题组表
  addAssessmentGroup: {
    url: '/assessmentGroupService/addAssessmentGroup',
    method: 'post'
  },
  delAssessmentGroup: {
    url: '/assessmentGroupService/delAssessmentGroup',
    method: 'post'
  },
  queryAssessmentGroupPage: {
    url: '/assessmentGroupService/queryAssessmentGroupPage',
    method: 'post'
  },
  updateAssessmentGroup: {
    url: '/assessmentGroupService/updateAssessmentGroup',
    method: 'post'
  },
  // 社区矫正人员信息表
  queryTermerInfoByPhase: {
    url: '/termerInfoService/queryTermerInfoByPhase',
    method: 'post'
  },
  queryTermerInfoByTermerId: {
    url: '/termerInfoService/queryTermerInfoByTermerId',
    method: 'post'
  },
  queryTermerInfoPage: {
    url: '/termerInfoService/queryTermerInfoPage',
    method: 'post'
  },
  // 矫正测评量表与阶段关系表
  addAssessmentPhase: {
    url: '/assessmentPhaseService/addAssessmentPhase',
    method: 'post'
  },
  addAssessmentPhaseList: {
    url: '/assessmentPhaseService/addAssessmentPhaseList',
    method: 'post'
  },
  queryAssessmentPhasePage: {
    url: '/assessmentPhaseService/queryAssessmentPhasePage',
    method: 'post'
  },
  queryPhaseAssessmentPage: {
    url: '/queryPhaseAssessmentPage/queryPhaseAssessmentPage',
    method: 'post'
  },
  // 矫正测评阶段表
  addPhase: {
    url: '/phaseService/addPhase',
    method: 'post'
  },
  delPhase: {
    url: '/phaseService/delPhase',
    method: 'post'
  },
  queryPhasePage: {
    url: '/phaseService/queryPhasePage',
    method: 'post'
  },
  updatePhase: {
    url: '/phaseService/updatePhase',
    method: 'post'
  }
}
export default assessment