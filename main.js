import App from './App'
import store from './store'
import imPlugin from './plugins/im'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import * as api from './config/api'
import uView from '@/uni_modules/uview-ui'

Vue.config.productionTip = false
uni.$api = api
Vue.use(uView)
Vue.use(imPlugin)

App.mpType = 'app'

Vue.mixin({
   created () {
    this._onResize = () => {
      const winH = window.innerHeight;
      let navH = 0;
      const nav = document.querySelector('uni-page-head');
      if (nav) navH = nav.offsetHeight;
      document.documentElement.style.setProperty('--real-height', `${winH - navH}px`);
    };
  },
  mounted () {
    this._onResize();
    window.addEventListener('resize', this._onResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this._onResize);
  },
  methods: {
    setRealHeight () {
      const winH = window.innerHeight;
      let navH = 0;
      const nav = document.querySelector('uni-page-head');
      if (nav) navH = nav.offsetHeight;
      document.documentElement.style.setProperty('--real-height', `${winH - navH}px`);
    }
  }
})

// Vue.mixin({
//   mounted () {
//     if (this.isWeiXinBrowser() || this.isQQBrowser()) {
//       this.navTitle()
//     }
//   },
//   beforeDestroy () { },
//   methods: {
//     isWeiXinBrowser () {
//       let ua = navigator.userAgent.toLowerCase()
//       return ua.indexOf('micromessenger') != -1
//     },
//     isQQBrowser () {
//       var ua = navigator.userAgent.toLowerCase()
//       if (ua.match(/QQ/i) == "qq") {
//         return true
//       } else {
//         return false
//       }
//     },
//     navTitle () {
//       this.$nextTick(() => {
//         try {
//           const navTitleDom = document.getElementsByTagName('uni-page-head')
//           if (navTitleDom.length) {
//             navTitleDom[0].style.display = 'none'
//             navTitleDom[0].style.height = '0px'
//             navTitleDom[0].style.padding = '0px'
//             navTitleDom[0].style.margin = '0px'
//           }
//         } catch (e) {
//           console.warn('隐藏导航栏失败:', e)
//         }
//       })
//     },
//   }
// })

const app = new Vue({
  store,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp () {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif