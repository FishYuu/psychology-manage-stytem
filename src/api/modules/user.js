const User = {
  queryUsersByRole: {
    url: '/userRoleService/queryRoleUsersPage',
    method: 'post'
  },
  queryUserList: {
    url: '/userService/queryUserList',
    method: 'post'
  },
  addUserRole: {
    url: '/userRoleService/addUserRole',
    method: 'post'
  },
  deleteUserRole: {
    url: '/userRoleService/delUserRole',
    method: 'post'
  },
  queryUserListByCode: {
    url: '/userService/queryUserListByCode',
    method: 'post'
  },
  queryUserPage: {
    url: '/userService/queryUserPage',
    method: 'post'
  }
}
export default User
