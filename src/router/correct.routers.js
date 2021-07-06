export default [
  {
    name: 'correction-list',
    component: () => import('@/views/correct/correction-list'),
    meta: {
      guardsName: '矫正对象信息',
      activeMenu: 'correction-list'
    }
  },
  {
    name: 'test-list-zp',
    component: () => import('@/views/correct/test-list-zp'),
    meta: {
      guardsName: '测评阅卷',
      activeMenu: 'test-list-zp'
    }
  },
  {
    name: 'test-list-zp-detail',
    component: () => import('@/views/correct/test-list-zp-detail'),
    meta: {
      guardsName: '测评阅卷-详情',
      activeMenu: 'test-list-zp'
    }
  },
  {
    name: 'test-list-tp',
    component: () => import('@/views/correct/test-list-tp'),
    meta: {
      guardsName: '他评补充',
      activeMenu: 'test-list-tp'
    }
  },
  {
    name: 'test-list-tp-detail',
    component: () => import('@/views/correct/test-list-tp-detail'),
    meta: {
      guardsName: '他评补充-详情',
      activeMenu: 'test-list-tp'
    }
  }
]
