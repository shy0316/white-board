<template>
  <div class="white-board-wrapper-footer">
    <div class="white-board-papigation">
      <div
        class="white-board-papigation-item" 
        @click="handleImageControlChaneg(operation.prev)">
        <Icon type="ios-arrow-back"/> 
        <span>{{ $t('whiteBoard.prevPage') }}</span>
      </div>
      <div
        class="white-board-papigation-item" 
        @click="handleImageControlChaneg(operation.next)">
        <span>{{ $t('whiteBoard.nextPage') }}</span>
        <Icon type="ios-arrow-forward"/>
      </div>
    </div>
    <div 
      class="white-board-footer-right" 
      @click="handleImageControlChaneg(operation.remove)">
      {{ $t('whiteBoard.removePicsGroup') }}
    </div>
  </div>
</template>

<script>
  import {
    IMAGE_REMOVE,
    IMAGE_PREV,
    IMAGE_NEXT,
  } from '../../const'
  export default {
    data () {
      const operation = {
        next: IMAGE_NEXT,
        prev: IMAGE_PREV,
        remove:IMAGE_REMOVE
      }
      return {
        operation
      }
    },
    created () {
      let vm = this
    },
    methods: {
      handleImageControlChaneg (operation) {
        this.$emit('on-image-operation-click',operation)
      },
    }
  }
</script>

<style scoped>
.white-board-wrapper-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 100%;
}

.white-board-papigation {
  display: flex;
  width: 140px;
  align-items: center;
  justify-content: space-between;
}

.white-board-footer-right {
  position: absolute;
  right: 20px;
  cursor: pointer;
}

.white-board-papigation-item {
  cursor: pointer;
}
</style>


