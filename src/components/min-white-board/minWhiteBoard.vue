<template>
  <div class="white-board-min-content" @mousedown="handleMousedown">
    <span class="onlineState"/> 
    <div>{{ $t('whiteBoard.boardGoing') }}</div>
    <div>
      <img
        class="white-board-min-btn"
        @click.stop="handleWindowOPerationClick(topBtns.close)"
        :src="closeIcon">
      <img
        class="white-board-min-btn"
        @click.stop="handleWindowOPerationClick(topBtns.normal)"
        :src="normalIcon">
    </div>
  </div>
</template>

<script>
  import {
    TOPBAR_CLOSE,
    TOPBAR_NORMAL
  } from '../../const'
  export default {
    data () {
      const topBtns = {
        close: TOPBAR_CLOSE,
        normal: TOPBAR_NORMAL,
      }
      return {
        normalIcon: require('../../static/images/normal.svg'),
        closeIcon: require('../../static/images/close.svg'),
        topBtns
      }
    },
    methods: {
      handleWindowOPerationClick (value) {
        this.$emit('on-window-operation-click',value)
      },
      handleMousedown (e) {
        this.$emit('on-drag-mouse-down',e)
      }
    }
  }
</script>

<style scoped>
.white-board-min-content {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0px 5px 0px 10px;
  color: #fff;
  font-size: 12px;
}

.white-board-min-btn {
  width: 20px;
  height: 20px;
  float: right;
  margin-right: 5px;
  cursor: pointer;
}

.onlineState {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  margin-right: 10px;
  background: #19be6b;
}

</style>


