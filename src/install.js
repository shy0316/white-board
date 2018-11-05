import { whiteBoard } from './components'
import locales from './locales'
import _ from 'lodash'
import './styles/index.css'

const install = function(Vue, options) {
  if (typeof window !== 'undefined' && window.Vue) {
    Vue = window.Vue
  }
  Vue.prototype._ = _
  Vue.component(whiteBoard.name, whiteBoard)
  Vue.prototype.$wbconfig = {
    apiDomain: options.apiDomain,
    uploadDomain: options.uploadDomain
  }
}

export default {
    install,
    locales
}