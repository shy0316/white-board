<template>
  <div class="white-board-top">
    <img
      class="white-board-top-btn"
      @click.stop="handleTopbarBtn(topBtns.close)"
      :src="closeIcon">
    <img
      class="white-board-top-btn"
      @click.stop="handleTopbarBtn(topBtns.normalAndMax)"
      :src="isMax ? normalIcon: maxIcon">
    <img
      class="white-board-top-btn"
      @click.stop="handleTopbarBtn(topBtns.min)"
      :src="minIcon">
  </div>    
</template>

<script>
  import {
    TOPBAR_CLOSE,
    TOPBAR_MIN,
    TOPBAR_NORMAL_MAX
  } from '../../const'
  export default {
    props: {
      isMax: {
        type: Boolean,
        default () {
          return false
        }
      },
    },
    data () {
      const topBtns = {
        close: TOPBAR_CLOSE,
        normalAndMax: TOPBAR_NORMAL_MAX,
        min: TOPBAR_MIN
      }
      return {
        normalIcon: require('../../static/images/normal.svg'),
        closeIcon: require('../../static/images/close.svg'),
        minIcon: require('../../static/images/min.svg'),
        maxIcon: require('../../static/images/max.svg'),
        topBtns
      }
    },
    methods: {
      handleTopbarBtn (value) {
        this.$emit('on-window-operation-click',value)
      }
    }
  }
</script>

<style scoped>
.white-board-top {
  height: 40px;
  padding: 9px;
  background-color: rgba(19,19,19,0.8);
}

.white-board-top-btn {
  width: 22px;
  height: 22px;
  float: right;
  margin-right: 10px;
  cursor: pointer;
}
</style>


