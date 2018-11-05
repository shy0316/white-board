<template>
  <div id="app">
    <button @click="whiteBoardShow = !whiteBoardShow">显示画板</button>
    <WhiteBoard
      ref="whiteboard"
      :is-master="isMaster"
      :show="whiteBoardShow"
      :ext-id="roomId"
      :user-info="userInfo"
      @on-white-board-hide="handleWhiteBoardHide"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      isMaster: true, /* 主持人才可以发送画板信息 */
      whiteBoardShow: false, /* 是否进入画板 */
      roomId: 195, /* 画板id */
      userInfo: {},
    }
  },
  created () {
    let vm = this
    window.onresize = function (){
      if(vm.$refs.whiteboard) {
        vm.$refs.whiteboard.handleWindowResize()
      }else {
        console.error('no this ref')
      }
    }
    /* Vue.use(whiteboard,{apiDomain: apiDomain, uploadDomain:uploadDomain}) */
    this.userInfo.token = 'HOTsNy3lPfmgQxLb.utgYViKPMrz9nyU7.d76d352c0256977934e812c1316d889e'
    this.userInfo.appkey = 'vg07ympsqc2jow8punz469xmhedabfit'
    this.userInfo.accountId="d0db3b2557f74d139b57d12ca7722f8b"
    this.userInfo.channel = '6'
  },
  methods: {
    handleWhiteBoardHide () {
      /* 画板隐藏处理 */
      this.whiteBoardShow = false
    }
  }

}
</script>

