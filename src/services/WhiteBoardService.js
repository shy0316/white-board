import WhiteBoardStageService from './WhiteBoardStageService'

import {
  STAGE_STATE_WORK,
  STAGE_STATE_LEAVE,
  TOOL_TYPE_BRUSH,
  TOOL_TYPE_ERASER,

} from '../const'

const TAG = 'white-board/WhiteBoardService'

export default class WhiteBoardService {
  constructor () {
    this.stageService = new WhiteBoardStageService()
    this.tool = null
    this.point = null
    this.image = null
    this.state = STAGE_STATE_LEAVE
    this.sendMsgInterval = null
  }

  initStageService (canvas, width, height) {
    this.stageService.init(canvas, width, height)
  }

  changeTool (tool) {
    this.tool = tool
  }

  changeImage (image,params) {
    this.image = image
    this.stageService.clear(params)
    this.stageService.resize(image.width, image.height)
  }

  execCmd (cmd, params) {
    if (!this.stageService[cmd]) {
      throw `no cmd ${cmd}`
    }
    this.stageService[cmd](params)
    
  }

  changeState (state) {
    this.state = state
  }

  ready (point,params) {
    let vm = this
    this.state = STAGE_STATE_WORK

    if (!this.tool) {
      return
    }

    if (this.tool.type === TOOL_TYPE_BRUSH) {
      this.stageService.drawReady(this.tool, point)
    }

    if (this.tool.type === TOOL_TYPE_ERASER) {
      this.stageService.clearCircle(point)
    }

    this.point = point
    this.sendMsgInterval = setInterval(function () {
      vm.stageService.sendMsg(params)
    },200)
  }

  work (point) {
    if (this.state !== STAGE_STATE_WORK) {
      return
    }

    if (!this.tool) {
      return
    }

    if (this.tool.type === TOOL_TYPE_BRUSH) {
      this.stageService.draw(point)
    }

    if (this.tool.type === TOOL_TYPE_ERASER) {
      this.stageService.clearCircle(point, this.point)
    }

    this.point = point
  }

  finish (params) {
    clearInterval(this.sendMsgInterval)
    if (this.state === STAGE_STATE_WORK) {
      if (this.tool) {
        this.stageService.finish(params)
      }
    }
    this.state = STAGE_STATE_LEAVE
  }
}



