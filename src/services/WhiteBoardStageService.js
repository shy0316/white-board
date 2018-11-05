
const TAG = 'white-board/WhiteBoardStageService'

export default class WhiteBoardStageService {
  constructor () {
    this.canvas = null
    this.context = null
    this.logs = []
    this.curLog = undefined
  }

  /**
   * 初始化
   */
  init (canvas, width, height) {
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
    this.resize(width, height)
  }

  /**
   * 重新设置舞台大小
   * @param { number } width 舞台宽
   * @param { number} height 舞台高
   */
  resize (width, height) {
    console.log(TAG, 'resize', width, height)
    if (!this.canvas) {
      return
    }

    if (this.logs.length && this.curLog != -1) {
      this.repaint (width, height)
    }
    this.width = width
    this.height = height
    this.canvas.setAttribute('width', this.width)
    this.canvas.setAttribute('height', this.height)
  }

  /**
   * 窗口大小变化后画布内容消失，重绘画布
   * @param { number } width 舞台宽
   * @param { number} height 舞台高
   */
  repaint (width, height) {
    const img = new Image()
    img.onload = () => {
      this.reset()
      this.context.drawImage(img, 0, 0, width, height)
    }
    img.src = this.logs[this.logs.length-1]
  }

  /**
   * 清空画布
   */
  reset () {
    console.log(TAG, 'reset')
    if (!this.canvas) {
      return
    }
    this.context.clearRect(0, 0, this.width, this.height)
  }

  clearLogs () {
    this.logs = []
    this.curLog = undefined
  }

  clear (params) {
    this.reset()
    this.clearLogs()
    this.sendMsg (params)
  }

  /**
   * 擦除一块圆形区域，没有fromPoint则清空point周围，有则清空fromPoint到point路线上的区域
   * @param {object} point 鼠标位置
   * @param {object | undefined} fromPoint 初始点
   */
  clearCircle (point, fromPoint) {
    console.log(TAG, 'clear', point)
    const radius = 10
    if (!this.context) {
      return
    }

    if (!fromPoint) {
      this._clearPoint(point, radius)
    } else {
      this._clearLine(fromPoint, point, radius)
    }
  }

  /**
   * 准备画图
   * @param {object} tool 当前选中的画笔
   * @param {object} point 当前鼠标的位置
   */
  drawReady (tool, point) {
    if (!this.context) {
      console.log(TAG, 'drawReady no context')
      return
    }

    this.context.beginPath()
    this.context.lineCap = 'round'
    this.context.lineJoin = 'round'
    this.context.lineWidth = tool.lineWidth
    this.context.strokeStyle = tool.strokeStyle
    this.context.moveTo(point.x, point.y)
  }

  /**
   * 画图
   * @param {object} point 鼠标当前的位置
   */
  draw (point) {
    if (!this.context) {
      console.log(TAG, 'draw no context')
      return
    }

    console.log(TAG, 'draw', point)
    this.context.lineTo(point.x, point.y)
    this.context.stroke()
  }

  /**
   * 完成画图，保存一份历史记录
   */
  finish (params) {
    this.curLog = undefined
    this.context.closePath()
    this._addLog(this.canvas.toDataURL('image/png'))
    this.sendMsg(params)
    console.log(TAG, 'finish', this.logs)
  }

  /* 
    发送画布信息
  */
  sendMsg (params,logInfo) {
    if (params && params.isMaster) {
      let data = {
        imgInfo: logInfo ? logInfo : this.canvas.toDataURL('image/png'),
        imgGroupIdx: params.curGroupIdx,
        imgInd: params.curInd
      }
      params.ciimClient.sendRoomMsg(JSON.stringify(data))
    }
  }
  /**
   * 回退
   */
  undo (params) {
    if (!this.logs || this.logs.length === 0) {
      return
    }

    if (this.curLog === -1) {
      return
    }

    if (this.logs.length >= 1) {
      if (typeof this.curLog === 'undefined') {
        this.curLog = this.logs.length - 2
      } else {
        this.curLog--
      }
    }

    const img = new Image()

    if (this.curLog === -1) {
      this.reset()
      this.sendMsg(params)
    } else {
      img.onload = () => {
        this.reset()
        this.context.drawImage(img, 0, 0)
      }
      img.src = this.logs[this.curLog]
      this._addLog(this.logs[this.curLog])
      this.sendMsg(params,this.logs[this.curLog])
    }
  }

  /**
   * 添加一条操作记录
   */
  _addLog (log) {
    if (this.logs.length === 100) {
      if (typeof this.curLog !== 'undefined' && this.curLog >= 0) {
        this.curLog--
      }
      this.logs.shift()
    }
    this.logs.push(log)
  }

  /**
   * 清除一个点的圆形区域
   */
  _clearPoint (point, radius) {
    this.context.save()
    this.context.beginPath()
    this.context.arc(point.x, point.y, radius, 0, Math.PI * 2)
    this.context.clip()
    this.context.clearRect(0, 0, this.width, this.height)
    this.context.restore()
  }

  /**
   * 清除一个矩形区域
   */
  _clearRect ([point1, point2, point3, point4]) {
    this.context.save()
    this.context.beginPath()
    this.context.moveTo(point1.x, point1.y)
    this.context.lineTo(point3.x, point3.y)
    this.context.lineTo(point4.x, point4.y)
    this.context.lineTo(point2.x, point2.y)
    this.context.closePath()
    this.context.clip()
    this.context.clearRect(0, 0, this.width, this.height)
    this.context.restore()
  }

  /**
   * 清除两个点之间的区域
   */
  _clearLine (fromPoint, toPoint, radius) {
    let sinL =
      radius *
      Math.sin(Math.atan((toPoint.y - fromPoint.y) / (toPoint.x - fromPoint.x)))
    let cosL =
      radius *
      Math.cos(Math.atan((toPoint.y - fromPoint.y) / (toPoint.x - fromPoint.x)))

    let rectPoint1 = {}
    rectPoint1.x = fromPoint.x + sinL
    rectPoint1.y = fromPoint.y - cosL

    let rectPoint2 = {}
    rectPoint2.x = fromPoint.x - sinL
    rectPoint2.y = fromPoint.y + cosL

    let rectPoint3 = {}
    rectPoint3.x = toPoint.x + sinL
    rectPoint3.y = toPoint.y - cosL

    let rectPoint4 = {}
    rectPoint4.x = toPoint.x - sinL
    rectPoint4.y = toPoint.y + cosL

    this._clearPoint(fromPoint, radius)
    this._clearRect([rectPoint1, rectPoint2, rectPoint3, rectPoint4])
    this._clearPoint(toPoint, radius)
  }
}
