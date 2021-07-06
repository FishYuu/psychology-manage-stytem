<template>
  <transition name="slide">
    <div class="gem-container">
      <div class="gem-header">
        <div class="breadcrumbs-container">
          {{ GEMNAME }}
          <!-- <el-breadcrumb separator="/">
            <template v-for="item in breadcrumbs">
              <el-breadcrumb-item :to="{ path: item.path }" :key="item.name">{{ item.meta.guardsName }}</el-breadcrumb-item>
            </template>
          </el-breadcrumb> -->
        </div>
        <div class="header-login-info">
          <div class="user-avatar">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
          </div>
          <div class="login-info">
            <div class="user-name">{{ loginUserName }}</div>
            <div class="user-role">{{ loginUserRole }}</div>
          </div>
        </div>
        <div class="login-out-btn" @click="loginOut">
          <i class="el-icon-switch-button"></i>
        </div>
      </div>
      <div class="gem-aside">
        <!-- <div class="gem-logo">
          <div class="logo-container">{{ firstName }}</div>
          <h4 class="logo-name">{{ shopName }}</h4>
        </div> -->
        <el-menu :default-active="defaultActiveMenu" class="el-menu-vertical-demo" :router="true">
          <template v-for="(menu, menuIndex) in formedMenus">
            <el-menu-item :index="menu.funcUrl" :key="menuIndex" :route="{ name: menu.funcUrl }" v-if="!menu.children || !menu.children.length">
              <i :class="menu.funcIcon"></i>
              <span slot="title">{{ menu.funcName }}</span>
            </el-menu-item>
            <el-submenu :index="menu.funcUrl" :key="menuIndex" v-else>
              <template slot="title">
                <i :class="menu.funcIcon"></i>
                <span>{{ menu.funcName }}</span>
              </template>
              <el-menu-item :index="submenu.funcUrl" v-for="(submenu, submenuIndex) in menu.children" :key="submenuIndex" :route="{ name: submenu.funcUrl }">
                {{ submenu.funcName }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </div>
      <div class="gem-main">
        <div class="gem-wrapper">
          <div class="gem-content">
            <div class="common-container">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import config from '../gem.config'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      GEMNAME: config.GEM_NAME,
      logo: require('assets/images/login-logo.png'),
      defaultActiveMenu: '',
      loginUserName: JSON.parse(window.sessionStorage.getItem('loginUser')).userName,
      loginUserRole: JSON.parse(window.sessionStorage.getItem('loginUser')).orgName
    }
  },
  computed: {
    firstName() {
      return this.shopName.substring(0, 1)
    },
    ...mapGetters(['formedMenus'])
  },
  watch: {
    $route: {
      handler(newVal) {
        this.defaultActiveMenu = newVal.meta.activeMenu
      },
      immediate: true
    }
  },
  methods: {
    loginOut() {
      this.$confirm('确定退出，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '点错了',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.clear()
          this.$router.replace({
            name: 'login'
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'common/styles/mixin.scss';
@import 'common/styles/variable.scss';

.gem-logo {
  text-align: center;
  padding: 12px 0;

  .logo-container {
    background-color: $theme-color;
    color: #ffffff;
    display: inline-block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    line-height: 60px;
    font-size: 28px;
  }

  .logo-name {
    margin: 6px;
  }
}

.gem-aside {
  float: left;
  width: 180px;
  height: calc(100vh - 70px);
}

.gem-header {
  padding: 0 22px;
  height: 70px;
  display: flex;
  align-items: center;
  position: relative;
  background-color: $theme-color;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid #aaaaaa;
    width: 200%;
    transform-origin: 0 0;
    transform: scale(0.5, 0.5);
    z-index: 999;
  }

  .breadcrumbs-container {
    font-size: 26px;
    font-weight: bold;
    color: #ffffff;
    letter-spacing: 6px;
    flex: 1;
  }

  .el-avatar {
    background-color: $theme-color;
  }

  .header-login-info {
    display: flex;
    align-items: center;

    .login-info {
      margin-left: 12px;
      font-size: 14px;
      color: #ffffff;
    }
  }

  .login-out-btn {
    margin-left: 16px;
    color: #e4293c;
    font-size: 24px;
    @include extend-click();
    cursor: pointer;
  }
}

.gem-main {
  margin-left: 180px;
  height: calc(100vh - 70px);
  position: relative;

  .gem-wrapper {
    overflow: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: #fafafa;
    min-width: 1260px;

    .gem-content {
      min-width: 1260px;
      height: 100%;
      position: relative;
    }
  }
}
</style>
