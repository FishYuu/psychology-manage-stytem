import Login from './modules/login'
import Base from './modules/base'
import Role from './modules/role'
import User from './modules/user'
import Group from './modules/group'
import FileUpload from './modules/files-upload'
import Menus from './modules/menus'
import Authority from './modules/role-authority'
import Assessment from './modules/assessment'
import TestService from './modules/testService'
const Api = {
  ...Login,
  ...Base,
  ...Role,
  ...User,
  ...Group,
  ...FileUpload,
  ...Menus,
  ...Authority,
  ...Assessment, // 量表管理
  ...TestService
}
export default Api