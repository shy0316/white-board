<template>
  <div
    v-show="show"
    class="white-board"
    id="white-board"
    :class="{ 'white-board-min': isMinize, 'white-board-max': isMaxize }">
    <Topbar
      v-show="!isMinize"
      :is-max="isMaxize"
      @on-window-operation-click="handleWindowOperationClick"/>
    <div class="white-board-content" v-show="!isMinize">
      <toolbar
        @on-tool-change="handleToolChange"
        @on-cmd-click="handleCmdClick"
        @on-drag-mouse-down= "handleMouseDown"/>
      <div
        class='white-board-wrapper'
        :style="{width:wrapperWidth+'px'}"
        ref="board">
        <div
          class="white-board-wrapper-top"
          :class="[imageGroup? 'white-board-has-img':'']">
          <img
            v-if="imageGroup"
            class="white-board-img"
            :width="`${Number(currentImg.width)}px`"
            :height="`${Number(currentImg.height)}px`"
            :src="currentImg.url">
          <stage
            class="white-board-stage"
            :is-master="isMaster"
            :cur-ind="curInd"
            :cur-group-idx="curGroupIdx "
            :current-img="currentImg"
            :ciim-client="ciimClient"
            :style="stageStyle"
            :width="imageWidth"
            :height="imageHeight"/>
          <img
            class="white-board-msg-img"
            v-if="roomMsg.masterSrc && !isMaster && isShowMasterPic"
            :src="roomMsg.masterSrc"
            :width="imageWidth"
            :height="imageHeight">
        </div>
        <image-operation
          v-if="imageGroup"
          @on-image-operation-click="handleImageOPerationChange"/>
      </div>
      <image-list
        ref="imgList"
        class="white-board-image-list"
        :is-show="isShowList"
        :ext-id="extId"
        @on-refresh-img-list="handleAudienceRefreshList"
        @on-save-group-list="handleSaveImageGroupList"
        @on-image-change="handleImageChange"
        @on-image-list-show="handleImageListShowChange"
      />
    </div>
    <min-white-board
      v-show="isMinize"
      @on-drag-mouse-down="handleMouseDown"
      @on-window-operation-click="handleWindowOperationClick"/>
  </div>
</template>

<script>
  import Topbar from '../topbar/topbar'
  import Toolbar from '../toolbar/WhiteBoardToolbar'
  import Stage from '../stage/WhiteBoardStage'
  import ImageList from '../image-list/WhiteBoardImageList'
  import ImageOperation from '../image-operation/imageOperation'
  import MinWhiteBoard from '../min-white-board/minWhiteBoard'
  import WhiteBoardService from '../../services/WhiteBoardService'
  import CiimService from '../../services/ciimService'
  import {webSocketProxy} from '../../services/index.js'
  import store from '../../common/store'
  import {
    CMD_CLEAR,
    TOPBAR_CLOSE,
    TOPBAR_MIN,
    TOPBAR_NORMAL_MAX,
    IMAGE_REMOVE,
    IMAGE_PREV,
  } from '../../const'
  const TAG = 'white-board/WhiteBoard'
  export default {
    name: 'WhiteBoard',
    props: {
      userInfo: {
        type: Object,
        default () {
          return {}
        }
      },
      extId:{
        type: Number,
        default () {
          return -999
        }
      },
      show: {
        type: Boolean,
        default () {
          return false
        }
      },
      isMaster: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    components: {
      Toolbar,
      Stage,
      ImageList,
      Topbar,
      ImageOperation,
      MinWhiteBoard
    },
    data () {
      return {
        wrapperWidth: 0,
        wrapperHeight: 0,
        imageGroupList: [],
        imageGroup: null,
        service: null,
        tool: null,
        currentImg: {
          url: '',
          width: '',
          height: ''
        },
        total: 0,
        curInd:0,
        curGroupIdx: -1,
        isMinize: false,
        isMaxize: false,
        normalIcon: require('../../static/images/normal.svg'),
        closeIcon: require('../../static/images/close.svg'),
        minIcon: require('../../static/images/min.svg'),
        maxIcon: require('../../static/images/max.svg'),
        boardElement: '',
        defaultValue: 280,
        isShowList: true,
        ciimClient: {},
        platformId: 201,
        intoCiimRoom:  false,
        roomMsg: {
          masterSrc: '',
          ind: -1,
          groupIdx: -1
        },
        isShowMasterPic: false
      }
    },
    watch: {
      show () {
        console.log('-----watch show',this.show)
        if(this.show) {
          this.initCiim()
        }else {
          if(this.intoCiimRoom) {
            this.ciimClient.leaveRoom()
            this.intoCiimRoom = false
          }
        }
      },
      extId () {
        this.service.execCmd(CMD_CLEAR)
        this.reset()
      }
    },
    computed: {
      imageWidth () {
        if (!this.currentImg.width) {
          return this.wrapperWidth
        }
        return Number(this.currentImg.width)
      },
      imageHeight () {
        if (!this.currentImg.height) {
          return this.wrapperHeight
        }
        return Number(this.currentImg.height)
      },
      stageStyle () {
        if (this.tool) {
          return  `cursor: url("${this.tool.icon}"),auto;`
        }
        return ''
      }
    },
    mounted () {
      this.boardElement = document.getElementById('white-board')
    },
    created () {
      if(this.show) {
        this.initCiim()
      }
      let vm = this
      if (vm.userInfo.appkey && vm.userInfo.channel && vm.userInfo.token && vm.userInfo.accountId) {
        store.store('loginInfo', vm.userInfo)
      }else{
        console.log('用户信息缺失')
      }
      this.ciimClient = new CiimService()
      console.log('ciimClient',this.ciimClient)
      this.service = new WhiteBoardService()
      vm.changeWrapperStyle()
    },
    methods: {
      async initCiim () {
        try {
          let ciimInfo = await this.getCiimInfo()
          this.ciimClient.init(ciimInfo.appkey, ciimInfo.appsecret)
          this.ciimClient.setDebug(false)
          this.ciimClient.setLoginStatusListener(this.ciimLoginStatusListener)
          this.ciimClient.setRoomListener(this.ciimRoomListener)
          this.login()
        }catch(e) {
          console.log(TAG,'initCiim',e.msg)
        }
      },
      async getCiimInfo () {
        let res = await webSocketProxy(
          'init')
        return res
      },
      ciimRoomListener (msg) {
        try {
          let data = msg.Content
          console.log('---recive--->',data)
          if(data == 'refreshImageList') {
            this.$refs.imgList.getPicsGroupList()
          }else {
            data = JSON.parse(data)
            let list = _.cloneDeep(this.imageGroupList)
            if(data.imgGroupIdx != this.imgGroupIdx || data.imgInd != this.curInd) {
              this.service.execCmd(CMD_CLEAR)
            }
            if (data.imgGroupIdx >= 0 ) {
              this.$set(this, 'imageGroup',list[data.imgGroupIdx])
              this.$set(this, 'total',this.imageGroup.pic.length-1)
              this.$set(this, 'curInd',data.imgInd)
              this.$set(this, 'currentImg',this.imageGroup.pic[this.curInd])
              this.$set(this.roomMsg, 'ind', data.imgInd)
              this.$set(this.roomMsg, 'groupIdx', data.imgGroupIdx)
            }else {
              this.reset ()
            }
            this.$set(this.roomMsg, 'masterSrc',data.imgInfo)
            this.$set(this, 'curGroupIdx', data.imgGroupIdx)
            this.$set(this, 'isShowMasterPic', true)
          }
        }catch(e) {
          console.log(TAG,'ciimRoomListener',e.msg)
        }
      },
      async login () {
        let vm = this
        let name = vm.userInfo.channel+''+vm.userInfo.accountId
        try {
          let res = await webSocketProxy(
            'api/login',
            name,
            '123',
            this.platformId)
          if(res.token) {
            this.ciimClient.login(name ,res.token,this.platformId)
          }
        }catch(e) {
          console.log(TAG,'login',e.msg)
        }
      },
      ciimLoginStatusListener (code, msg) {
        console.log('------ciimLoginStatusListener',code+'&'+msg)
        if(code == 200) {
          this.enterCiimRoom ()
        }
      },
      enterCiimRoom () {
        let vm = this
        this.ciimClient.enterRoom(this.extId+'',function (code,msg) {
          if (code == 200) {
            vm.intoCiimRoom = true
          }else {
            vm.intoCiimRoom = false
          }
        })
      },
      handleWindowResize () {
        let vm = this
        vm.changeModalPosition()
        vm.changeWrapperStyle()
      },
      mousedown (event) {
        let selectElement = this.boardElement
        selectElement.style.cursor = 'move'
        var distanceX = event.clientX - selectElement.offsetLeft
        var distanceY = event.clientY - selectElement.offsetTop
        document.onmousemove = function (ev) {
          var oevent = ev || window.event
          var iL = oevent.clientX - distanceX
          var iT = oevent.clientY - distanceY
          var maxL = document.documentElement.clientWidth - selectElement.offsetWidth
          var maxT = document.documentElement.clientHeight - selectElement.offsetHeight
          iL <=0 && (iL = 0)
          iT <=0 && (iT = 0)
          iL >=maxL && (iL = maxL)
          iT >= maxT && (iT = maxT)
          selectElement.style.left = iL + 'px'
          selectElement.style.top = iT + 'px'
          return false
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
          selectElement.style.cursor = 'default'
        }
      },
      changeModalPosition () {
        let ele = this.boardElement
        if( this.isMinize) {
          ele.style.left = (document.documentElement.clientWidth - 210) + 'px'
          ele.style.top = (document.documentElement.clientHeight - 150) + 'px'
        }else {
          ele.style.left = '10%'
          ele.style.top =  '5%'
        }
        if(this.isMaxize) {
          ele.style.left = '0px'
          ele.style.top =  '0px'
        }
      },
      changeWrapperStyle () {
        let value = this.defaultValue
        if(!this.isShowList) {
          value = 60
        }
        if(this.isMaxize) {
          this.$set(this,'wrapperWidth',document.documentElement.clientWidth - value)
          this.$set(this,'wrapperHeight',document.documentElement.clientHeight - 40)
          return
        }
        if(this.isMinize) {
          return
        }
        this.$set(this,'wrapperWidth',document.documentElement.clientWidth * 0.8 - value)
        this.$set(this,'wrapperHeight',document.documentElement.clientHeight* 0.9 - 40)
      },
      reset () {
        this.$set(this, 'imageGroup', null)
        this.$set(this, 'total', 0)
        this.$set(this, 'curInd', 0)
        this.$set(this, 'curGroupIdx', -1)
        this.$set(this.currentImg, 'url', '')
        this.$set(this.currentImg, 'width', '')
        this.$set(this.currentImg, 'height', '')
        this.$set(this.roomMsg, 'masterSrc', '')
        this.$set(this.roomMsg, 'ind', -1)
        this.$set(this.roomMsg, 'groupIdx', -1)
        this.changeWrapperStyle ()
      },
      handleToolChange (tool) {
        this.service.changeTool(tool)
        this.tool = tool
      },
      handleCmdClick (cmd) {
        let vm = this
        if(cmd.command == CMD_CLEAR) {
          this.$Modal.confirm({
            content: vm.$t('whiteBoard.clearTip'),
            onOk: () => {
              this.service.execCmd(cmd.command,vm.getSendMsg())
            }
          })
        }else {
          this.service.execCmd(cmd.command,vm.getSendMsg())
        }
        console.log(TAG, 'handleCmdClick', cmd)
      },
      handleMouseDown (e) {
        this.mousedown(e)
      },
      handleSaveImageGroupList (list) {
        this.$set(this,'imageGroupList',list)
      },
      handleAudienceRefreshList () {
        this.ciimClient.sendRoomMsg('refreshImageList')
      },
      handleImageChange (param) {
        try {
          this.$set(this, 'curGroupIdx',param.idx)
          let group = _.cloneDeep(param.imageGroup)
          this.$set(this, 'imageGroup',group)
          this.$set(this, 'total',group.pic.length-1)
          this.$set(this, 'curInd',0)
          this.$set(this, 'currentImg',group.pic[this.curInd])
          this.service.changeImage(this.currentImg,this.getSendMsg())
          this.handleShowMasterPic()
        }catch(e) {
          console.log(TAG, 'handleImageChange',e.msg)
        }
      },
      handleImageListShowChange (value) {
        this.$set(this, 'isShowList', value)
        this.changeWrapperStyle()
      },
      handleImageOPerationChange (operation) {
        if(operation == IMAGE_REMOVE) {
          this.removePicGroup ()
        }else {
          this.changeCurrentImg(operation)
        }
        this.handleShowMasterPic()
      },
      handleShowMasterPic () {
        if( this.curGroupIdx == this.roomMsg.groupIdx && this.curInd == this.roomMsg.ind) {
          this.$set(this, 'isShowMasterPic', true)
        }else {
          this.$set(this, 'isShowMasterPic', false)
        }
      },
      getSendMsg () {
        let params = {
          ciimClient: this.ciimClient,
          isMaster: this.isMaster,
          curInd: this.curInd,
          curGroupIdx: this.curGroupIdx,
          ...this.currentImg
        }
        return params
      },
      removePicGroup () {
        this.reset ()
        this.service.execCmd(CMD_CLEAR,this.getSendMsg())
      },
      changeCurrentImg (direction) {
        let vm = this
        if(direction == IMAGE_PREV) {
          if(this.curInd > 0) {
            this.$set(this, 'curInd', this.curInd -1)
            this.currentImg = this.imageGroup.pic[this.curInd]
            this.service.changeImage(this.currentImg,vm.getSendMsg())
          }else {
            this.$Message.info('已经是第一页！')
          }
        }else{
          if(this.curInd < this.total) {
            this.$set(this, 'curInd', this.curInd + 1)
            this.currentImg = this.imageGroup.pic[this.curInd]
            this.service.changeImage(this.currentImg,vm.getSendMsg())
          }else {
            this.$Message.info('已经是最后一页！')
          }
        }
      },
      handleWindowOperationClick (value) {
        if (value == TOPBAR_NORMAL_MAX) {
          this.$set(this,'isMinize',false)
          this.$set(this,'isMaxize',!this.isMaxize)
        }else if (value == TOPBAR_CLOSE) {
          this.$set(this, 'isMaxize', false)
          this.$set(this, 'isMinize', false)
          this.$emit('on-white-board-hide')
        }else if (value == TOPBAR_MIN){
          this.$set(this, 'isMinize', true)
          this.$set(this,'isMaxize',false)
        }else {
          this.$set(this,'isMinize',false)
          this.$set(this,'isMaxize',false)
        }
        this.changeWrapperStyle()
        this.changeModalPosition ()
      },
    }
  }
</script>

<style scoped>
.white-board {
  position: fixed;
  left: 10%;
  top:5%;
  right: 10%;
  bottom: 5%;
  width: 80%;
  display: -ms-flexbox;
  display: flex;
  flex-direction:column;
  height: 90%;
  background: #fff;
}

.white-board-max {
  left: 0px;
  top: 0px;
  right:0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
}

.white-board-min {
  width: 186px;
  height: 40px;
  left: calc(100% - 210px);
  top: calc(100% - 150px);
  border-radius: 3px;
  -webkit-box-shadow:3px 3px 2px #888888;
  -moz-box-shadow: 3px 3px 2px #888888;
  box-shadow: 3px 3px 2px #888888;
  background-color: rgba(19,19,19,0.8)
}

.white-board-content {
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  width: 100%;
}

.white-board-wrapper {
  height: 100%;
  position: relative;
  padding: 0;
  margin: 0;
}

.white-board-wrapper-top {
  overflow: auto;
  height: 100%;
  position: relative;
}

.white-board-has-img {
  height: calc(100% - 40px);
}

.white-board-img {
  position: absolute;
  top: 0px;
  z-index:0;
}

.white-board-stage {
  position: absolute;
  top: 0px;
  z-index:2;
}

.white-board-msg-img {
  position: absolute;
  top: 0px;
  z-index:1;
}

.white-board-image-list {
  z-index: 3
}
</style>


