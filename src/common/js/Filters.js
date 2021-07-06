const patrolTypeEnums = {
  '0': '路线巡逻',
  '1': '点巡逻',
  '2': '区域巡逻'
}
const patrolSubTypeEnums = {
  '0': {
    '1': '日常巡查',
    '2': '临时路线'
  },
  '1': {
    '1': '日常点',
    '2': '临时点'
  },
  '2': {
    '1': '重点区域',
    '2': '日常区域'
  }
}

export default {
  data() {
    return {
      labelTypeList: [{
          label: '单位',
          value: 'unit'
        },
        {
          label: '房屋',
          value: 'house'
        },
        {
          label: '人员',
          value: 'person'
        }
      ],
      fieldTypeList: [{
          label: '文本',
          value: 'text'
        },
        {
          label: '单选框',
          value: 'radio'
        },
        {
          label: '下拉选择',
          value: 'select'
        },
        {
          label: '多选',
          value: 'checkbox'
        },
        {
          label: '长文本',
          value: 'textarea'
        },
        {
          label: '数字',
          value: 'number'
        },
        {
          label: '人员选择',
          value: 'personSelect'
        },
        {
          label: '部门选择',
          value: 'deptSelect'
        },
        {
          label: '日期选择',
          value: 'date'
        },
        {
          label: '月份选择',
          value: 'month'
        },
        {
          label: '日期',
          value: 'datetime'
        },
        {
          label: '附件',
          value: 'attach'
        }
      ]
    }
  },
  methods: {
    colorConfig(value) {
      switch (value) {
        case 0:
          return '#E6A23C'
        case 1:
          return '#909399'
        case 2:
          return '#67C23A'
        case 3:
          return '#67C23A'
        case 4:
          return '#E6A23C'
        case 5:
          return '#F56C6C'
        default:
          return ''
      }
    },
    tagTypeConfig(value) {
      switch (value) {
        case 0:
          return 'warning'
        case 1:
          return 'info'
        case 2:
          return 'success'
        case 3:
          return 'success'
        case 4:
          return 'warning'
        case 5:
          return 'danger'
        default:
          return ''
      }
    },
    buttonView(val) {
      return val === 'Y'
    },
    patrolTypeToString(value) {
      return patrolTypeEnums[value]
    },
    patrolSubTypeToString(patrolType, patrolSubType) {
      return patrolSubTypeEnums[patrolType][patrolSubType]
    }
  },
  filters: {
    roleStatusToString(val) {
      if (val === 1 || val === '1') {
        return '有效'
      }
      if (val === 0 || val === '0') {
        return '无效'
      }
    },
    // 用户类型  0：警员；1：非警员（辅警）；2：新警（现役）；4：单位用户；5：文员（在编工勤）
    userTypeToString(val) {
      switch (val) {
        case '0':
          return '警员'
        case '1':
          return '非警员（辅警）'
        case '2':
          return '新警（现役）'
        case '4':
          return '单位用户'
        case '5':
          return '文员（在编工勤）'
      }
    },
    // 时间格式化
    dateFormat(date, fmt) {
      if (!date) {
        return ''
      }
      if (Object.prototype.toString.call(date) !== '[object Date]') {
        date = new Date(date)
      }
      let ret
      let opt = {
        'y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
        }
      }
      return fmt
    },
    faultStatusToString(value) {
      switch (value) {
        case 0:
          return '已申请'
        case 1:
          return '已派单'
        case 2:
          return '已维修'
        case 3:
          return '已确认'
        case 4:
          return '无需修理'
        case 5:
          return '确认不通过'
        default:
          return ''
      }
    },
    patrolTypeToString(value) {
      return patrolTypeEnums[value]
    },
    patrolSubTypeToString(patrolType, patrolSubType) {
      return patrolSubTypeEnums[patrolType][patrolSubType]
    },
    // 周期类型
    cycleToString(val) {
      switch (val) {
        case 'year':
          return '年'
        case 'quarter':
          return '季度'
        case 'month':
          return '月'
        case 'week':
          return '星期'
        case 'day':
          return '日'
      }
    },
    fieldTypeToString(val) {
      switch (val) {
        case 'text':
          return '文本'
        case 'radio':
          return '单选框'
        case 'select':
          return '下拉单选'
        case 'checkbox':
          return '多选'
        case 'textarea':
          return '长文本'
        case 'number':
          return '数字'
        case 'personSelect':
          return '人员选择'
        case 'deptSelect':
          return '部门选择'
        case 'date':
          return '日期选择'
        case 'month':
          return '月份选择'
        case 'datetime':
          return '日期'
        case 'attach':
          return '附件'
      }
    },
    assessStatus2String(val) {
      switch (val) {
        case 'DPG':
          return '待评估'
        case 'YPG':
          return '已评估'
      }
    },
    subjectType2String(value) {
      switch (value) {
        case 'EC':
          return '单选'
        case 'MC':
          return '多选'
        case 'FTB':
          return '填空'
        default:
          return ''
      }
    },
    termerStatusString(value) {
      switch (value) {
        case '0':
          return '解矫'
        case '1':
          return '在册'
        case '2':
          return '待接收'
        case '3':
          return '未按时报到'
        case '4':
          return '矫正中止'
      }
    }
  }
}