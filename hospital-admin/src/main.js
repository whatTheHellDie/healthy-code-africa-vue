import Vue from 'vue'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueI18n from 'vue-i18n'
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import enLocale from '@/utils/language/en.js'
import zhLocale from '@/utils/language/zh-CN.js'
import frLocale from '@/utils/language/fr.js'

import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
Vue.use(VueCookie)
Vue.config.productionTip = false
import PhoneColumn from './components/PhoneColumn' //注册全局pc手机共用表格
Vue.use(PhoneColumn)
// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}
import axios from 'axios'
Vue.prototype.$axios=axios;
// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法
Vue.prototype.$closeWindow = (name)=>{ //关闭当前选项卡窗口
  if(window.removeTabHandle){
    if(name){
      window.removeTabHandle(name)
    }
  }
}     // 权限方法

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)
Vue.use(VueI18n)
function getLocalLang(){
  var lang = navigator.language||navigator.userLanguage;//常规浏览器语言和IE浏览器
      lang = lang.substr(0, 2);//截取lang前2位字符
      if(lang == 'fr'){
        return 'fr'
      }else if(lang == 'zh'){
          return 'zh-cn'
      }else{
         return 'en'
      }

}
Vue.config.lang = window.localStorage.language?window.localStorage.language:getLocalLang
Vue.locale('zh-cn', zhLocale)
Vue.locale('en', enLocale)
Vue.locale('fr', frLocale)
Vue.prototype.$setLang =(lang)=>{
  window.localStorage.language=lang;
  Vue.config.lang = lang
  window.location.reload()
}
Vue.prototype.$getLang =()=>{
  return Vue.config.lang;
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
//i18n,
  template: '<App/>',
  components: { App }
})
