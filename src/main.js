// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueI18n from 'vue-i18n'
import whiteBoard from './install'
import VueX from 'vuex'
import IView from 'iview'
import 'iview/dist/styles/iview.css'
Vue.use(VueX)
Vue.use(IView)
Vue.use(VueI18n)
Vue.config.productionTip = false
Vue.use(whiteBoard, {
  apiDomain: 'https://w4823bbd72c650f7-dev.oneitfarm.com',
  uploadDomain: 'https://w3ae581b1ed587c5-dev.oneitfarm.com/'
})
const i18n = new VueI18n({
  locale: 'zh-CN', // set locale
  messages: whiteBoard.locales // set locale messages
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  components: { App },
  template: '<App/>'
})
