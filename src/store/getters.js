let formedMenus = []
export default {
  formedMenus(state) {
    let oriMenus = state.menus.length > 0 ? state.menus : JSON.parse(window.sessionStorage.getItem('loginUserFunc'))
    if (oriMenus) {
      recursiveMenus(oriMenus)
    }
    return formedMenus
  }
}
function recursiveMenus(oriArr, parent) {
  if (!parent) {
    formedMenus = oriArr.filter(v => !v.funcParent)
    formedMenus.forEach(menu => {
      recursiveMenus(oriArr, menu)
    })
  } else {
    if (oriArr.filter(v => v.funcParent === parent.funcCode) && oriArr.filter(v => v.funcParent === parent.funcCode).length > 0) {
      parent.children = oriArr.filter(v => v.funcParent === parent.funcCode)
      parent.children.forEach(subMenu => {
        recursiveMenus(oriArr, subMenu)
      })
    }
  }
}
