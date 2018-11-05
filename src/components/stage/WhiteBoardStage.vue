<template>
  <canvas
    @mousedown="handleMousedown"
    @mousemove="handleMousemove"
    @mouseup="handleMouseupOrLeave"
    @mouseleave="handleMouseupOrLeave"
    ref="stage"
    class="white-board-canvas"/>
</template>

<script>
  const TAG = 'white-board/WhiteBoardStage'

  export default {
    props: {
      width: {
        type: Number,
        default: 1600
      },
      height: {
        type: Number,
        default: 1200
      },
      ciimClient: {
        type: Object,
        default (){
          return {}
        }
      },
      isMaster: {
        type: Boolean,
        default () {
          return false
        }
      },
      curGroupIdx: {
        type: Number,
        default: -1
      }, 
      curInd: {
        type: Number,
        default: 0
      },
      currentImg: {
        type: Object,
        default (){
          return {}
        }
      } 
    },

    watch: {
      width () {
        this.canvas = this.$refs['stage']
        this.service.initStageService(this.canvas, this.width, this.height)
      },
      height () {
        this.canvas = this.$refs['stage']
        this.service.initStageService(this.canvas, this.width, this.height)
      }
    },
    data () {
      return {
        canvas: undefined,
        service: null,
        canvasRect: null
      }
    },
    created () {
      this.service = this.$parent.service
    },

    mounted () {
      this.$nextTick(() => {
        this.canvas = this.$refs['stage']
        this.service.initStageService(this.canvas, this.width, this.height)
      })
    },

    methods: {
      handleMousedown (e) {
        console.log(TAG, 'handleMousedown', e)
        let params = {
          ciimClient: this.ciimClient,
          isMaster: this.isMaster,
          curInd: this.curInd,
          curGroupIdx: this.curGroupIdx,
          ...this.currentImg
        }
        this.service.ready(this.getPoint(e),params)
      },
      handleMousemove (e) {
        this.service.work(this.getPoint(e))
      },
      handleMouseupOrLeave (e) {
        let params = {
          ciimClient: this.ciimClient,
          isMaster: this.isMaster,
          curInd: this.curInd,
          curGroupIdx: this.curGroupIdx,
          ...this.currentImg
        }
        console.log(TAG, 'handleMouseupOrLeave', e)
        this.service.finish(params)
      },
      getPoint (e) {
        if (!this.canvas) {
          throw 'canvas not ready'
        }
        this.canvasRect = this.canvas.getBoundingClientRect()
        return {
          x: e.pageX - this.canvasRect.left,
          y: e.pageY - this.canvasRect.top
        }
      }
    }
  }
</script>


