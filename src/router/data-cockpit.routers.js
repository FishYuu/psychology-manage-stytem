export default [
  {
    path: '/data-cockpit/data-cockpit',
    name: 'data-cockpit',
    component: () => import('@/views/data-cockpit/data-cockpit'),
    meta: {
      guardsName: '数据驾驶舱',
      activeMenu: 'data-cockpit'
    }
  }
]
