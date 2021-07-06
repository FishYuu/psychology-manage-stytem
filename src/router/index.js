import Vue from 'vue'
import VueRouter from 'vue-router'
const routerList = []
function importAll(r) {
  r.keys().forEach(key => {
    routerList.push(...r(key).default)
  })
}
importAll(require.context('./', true, /\.routers\.js/))
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/gem-soft'
  },
  {
    path: '/gem-soft',
    name: 'gem-soft',
    component: () => import('@/index'),
    meta: {
      guardsName: '首页'
    },
    // children: routerList
    children: [
      {
        path: '/gem-soft',
        redirect: () => {
          return {
            name: routerList.findIndex(item => item.name === 'data-cockpit') !== -1 ? 'data-cockpit' : routerList[0].name
          }
        }
      },
      ...routerList
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/login'),
    meta: {
      title: '登录'
    }
  }
]

function recursiveRouterAndFormat(routes, parentPath) {
  routes.forEach(route => {
    route.path = route.path || parentPath + '/' + (route.name || '')
    if (route.children && route.children.length > 0) {
      recursiveRouterAndFormat(route.children, route.path)
    }
  })
}
recursiveRouterAndFormat(routes, '')

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    if (!window.sessionStorage.getItem('loginUser')) {
      next({ name: 'login' })
    } else {
      next()
    }
  }
})

export default router
