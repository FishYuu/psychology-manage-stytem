<template>
  <div class="title-box">
    <div class="title" v-html="title"></div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'gemBox',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
@import 'common/styles/variable.scss';
.title-box {
  border: 1px dashed $theme-color;
  position: relative;
  padding: 16px 16px 8px;
  .title {
    color: $theme-color;
    position: absolute;
    top: -13px;
    left: 10px;
    background-color: #ffffff;
    padding: 0 6px;
  }
}
</style>
