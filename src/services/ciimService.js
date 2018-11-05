import IMSDK from 'ciim_sdk'
const TAG = 'white/ciimService'

export default class CiimService {
  constructor () {
    this.im = {}
    this._config = {}
  }
  //初始化
  init (appkey, appsecret) {
    this.im = new IMSDK.IMService(appkey, appsecret)
    this._config.ws_url = 'wss://ciimwss.nibaguai.com:31134'
    this._config.api_url = 'https://ciim.nibaguai.com/im_api'
    this.im.init(this._config.ws_url,this._config.api_url)
  }
  //登录
  login (username, token, platform ) {
    this.im.login(username, token, platform)
  }
  //设置debug模式
  setDebug (isDebug) {
    this.im.setDebug(isDebug)
  }

  // 设置登录状态回调
  setLoginStatusListener (callback) {
    this.im.setLoginStatusListener(callback)
  }
  // 设置网络连接成功回调
  setConnectListener (callback) {
    this.im.setConnectListener(callback)
  }
  // 设置网络连接断开回调
  setDisconncetListener (callback) {
    return this.im.setDisconncetListener(callback)
  }
  // 设置网络重连回调
  setTryconnectListener (callback) {
    this.im.setTryconnectListener(callback)
  }
  // 网络失败
  setNetFailListener (callback) {
    this.im.setNetFailListener(callback)
  }
  //进入房间
  enterRoom (roomId, cb) {
    this.im.enterRoom(roomId, cb)
  }
  // 离开房间
  leaveRoom (cb) {
    this.im.leaveRoom(cb)
  }
  //发送聊天室消息
  sendRoomMsg (content, cb) {
    console.log('@@@@@@@send info',content)
    this.im.sendRoomMsg(content, cb)
  }
  //聊天室消息回调
  setRoomListener (cb) {
    this.im.setRoomListener(cb)
  }
  //主动端开
  disconnect () {
    this.im.disconnect ()
  }

}
