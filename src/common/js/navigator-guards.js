import router from '@/router/index'
import store from '@/store/index'
router.afterEach(to => {
  store.commit('SETCRUMBS', to.matched)
})
