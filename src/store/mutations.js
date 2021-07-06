export default {
  SETCRUMBS(state, list) {
    state.breadcrumbs = list
  },
  SETACTIVEMENU(state, activeMenu) {
    state.activeMenu = activeMenu
  },
  SETMENUS(state, list) {
    state.menus = list
  }
}
