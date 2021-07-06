const Role = {
  addRole: {
    url: '/roleService/addRole',
    method: 'post'
  },
  getRoleList: {
    url: '/roleService/queryRolePage',
    method: 'post'
  },
  deleteRole: {
    url: '/roleService/delRoleById',
    method: 'post'
  },
  updateRole: {
    url: '/roleService/updateRole',
    method: 'post'
  },
  queryOrgTree: {
    url: '/orgService/queryOrgTree',
    method: 'post'
  }
}
export default Role
