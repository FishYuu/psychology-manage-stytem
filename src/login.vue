<template>
  <div class="gem-container" :style="{ backgroundImage: 'url(' + bg + ')' }">
    <div class="login-container">
      <div class="login-left-bg" :style="{ backgroundImage: 'url(' + loginLeft + ')' }"></div>
      <div class="login-form" for="name">
        <div class="login-logo">
          <!-- <img :src="loginLogo" /> -->
        </div>
        <div class="login-title">心理测评系统</div>
        <label class="login-account">
          <span class="input-icon">
            <i class="iconfont icon-zhanghao1"></i>
          </span>
          <input id="name" type="text" placeholder="请输入账号" name="account" v-model.trim="username" />
        </label>
        <label class="login-account" for="password">
          <span class="input-icon">
            <i class="iconfont icon-password"></i>
          </span>
          <input id="password" type="password" placeholder="请输入密码" name="password" v-model.trim="password" @keyup.enter="login" />
        </label>
        <div class="login-btn-container">
          <div class="login-btn" @click="login">登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/api/apis'
export default {
  data() {
    return {
      bg: require('assets/images/login.png'),
      loginLeft: require('assets/images/login-left.png'),
      loginLogo: require('assets/images/login-logo.png'),
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      const param = {
        idCard: this.cardId,
        loginName: this.username,
        loginPassword: this.password
      }
      this.$http(Api.appLogin, param).then(ret => {
        window.sessionStorage.setItem('loginUser', JSON.stringify({ ...ret.user}))
        window.sessionStorage.setItem('loginUserFunc', JSON.stringify(ret.funcList))
        this.$store.commit('SETMENUS', ret.funcList)
        this.$router.replace({
          name: 'data-cockpit'
        })
      })
      // this.$router.replace({
      //   name: 'index'
      // })
    }
  }
}
</script>

<style scoped lang="scss">
@import 'common/styles/mixin.scss';
.title {
  text-align: center;
  font-size: 22px;
  padding-top: 100px;
  color: #ffffff;
}
.gem-container {
  @include bg-style;
  .login-container {
    position: absolute;
    left: 50%;
    width: 980px;
    margin-left: -490px;
    top: 20%;
    height: 560px;
    display: flex;
    box-shadow: 0 0 16px #7366b2;
    border-radius: 12px;
    overflow: hidden;
    .login-left-bg {
      width: 50%;
      height: 100%;
      @include bg-style;
    }
    .login-form {
      width: 50%;
      height: 100%;
      background-color: #ffffff;
      .login-logo {
        text-align: center;
        padding: 40px 0 30px;
      }
      .login-title {
        font-size: 28px;
        text-align: center;
      }
      .login-account {
        border-bottom: 1px solid #dddddd;
        width: 80%;
        margin: 0 auto;
        padding: 16px 0;
        display: block;
        input {
          border: none;
          background-color: transparent;
          width: 70%;
        }
        .input-icon {
          font-size: 24px;
          margin-right: 16px;
        }
      }
      .login-btn-container {
        margin-top: 60px;
      }
      .login-btn {
        width: 50%;
        margin: 0 auto;
        color: #ffffff;
        background-color: #3bb865;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-radius: 8px;
        cursor: pointer;
      }
    }
  }
}
</style>
