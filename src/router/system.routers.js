export default [
  {
    name: 'role-list',
    component: () => import('@/views/system/role-list'),
    meta: {
      guardsName: '角色管理',
      activeMenu: 'role-list'
    }
  },
  {
    name: 'role-user-list',
    component: () => import('@/views/system/role-user-list'),
    meta: {
      guardsName: '角色用户管理',
      activeMenu: 'role-user-list'
    }
  },
  {
    name: 'group-list',
    component: () => import('@/views/system/group-list'),
    meta: {
      guardsName: '角色分组管理',
      activeMenu: 'group-list'
    }
  },
  {
    name: 'menu-list',
    component: () => import('@/views/system/menu-list'),
    meta: {
      guardsName: '菜单管理',
      activeMenu: 'menu-list'
    }
  },
  {
    name: 'authority-list',
    component: () => import('@/views/system/authority-list'),
    meta: {
      guardsName: '权限管理',
      activeMenu: 'authority-list'
    }
  },
  {
    name: 'assessment-list',
    component: () => import('@/views/correct/assessment-list'),
    meta: {
      guardsName: '量表管理',
      activeMenu: 'assessment-list'
    },
    children: [

      {
        path: '/assessment-detail',
        name: 'assessment-detail',
        component: () => import('@/views/correct/assessment-detail'),
        meta: {
          guardsName: '量表详情',
          activeMenu: 'assessment-list'
        },
        children: [
          {
            path: '/group-question-detail',
            name: 'group-question-detail',
            component: () => import('@/views/correct/group-question-detail'),
            meta: {
              guardsName: '题库详情'
            }
          },
          {
            path: '/standard-detail',
            name: 'standard-detail',
            component: () => import('@/views/correct/standard-detail'),
            meta: {
              guardsName: '指标详情',
              activeMenu: 'assessment-list'
            }
          }
        ]
      }
    ]
  }
]
