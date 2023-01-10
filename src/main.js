// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import util from '@/libs/util';
import api from './api';
import mystore from './libs/myStore';
import store from "@/store/storeconfig";
import hconfig from '@/libs/httpconfig';
Vue.config.productionTip = false  //默认是true,  设置false 阻止 vue 在启动时生成生产提示;开发环境下，Vue 会提供很多警告来帮你对付常见的错误与陷阱。而在生产环境下，这些警告语句却没有用，反而会增加应用的体积。此外，有些警告检查还有一些小的运行时开销，这在生产环境模式下是可以避免的


//引入  view-design
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);
// view -design国际化【View UI（iView） 的所有组件文案默认使用的是中文，通过设置可以使用其它语言。】  兼容 vue-i18n@6.x+
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
Vue.locale = () => { };
// Create VueI18n instance with options
import zh from './assets/i18n/zh-CN'; //中文语言包
import en from './assets/i18n/en-US';  //英文语言包
import ja from './assets/i18n/ja-JP'; //日语
import ko from './assets/i18n/ko-KR'; // 韩语
import iviewLangsConfig from './assets/i18n/iview-lang-config'

const messages = {
  zh_CN: Object.assign(zh, iviewLangsConfig['zh']),
  en_US: Object.assign(en, iviewLangsConfig['en']),
  ja_JP: Object.assign(ja, iviewLangsConfig['ja']),
  ko_KR: Object.assign(ko, iviewLangsConfig['ko']),
}
const i18n = new VueI18n({
  locale: 'zh_CN',  // set locale
  fallbackLocale: 'zh_CN',
  messages  // set locale messages
});
// 工具包
Vue.prototype.$util = util;
// 持久化存储
Vue.prototype.$mystore = mystore;
// Axios 
Vue.prototype.$http = hconfig.http;
// api
Vue.prototype.$api = api;


/**
 *
 * @returns Window 接口的devicePixelRatio返回当前显示设备的物理像素分辨率与CSS 像素分辨率之比。
 *  此值也可以解释为像素大小的比率：一个 CSS 像素的大小与一个物理像素的大小。
 * 简单来说，它告诉浏览器应使用多少屏幕实际像素来绘制单个 CSS 像素。
 */
const detectZoom = () => {
  let ratio = 0;
  let screen = window.screen;
  let ua = navigator.userAgent.toLowerCase();
  if (window.devicePixelRatio != undefined) {
    ratio = window.devicePixelRatio;
  } else if (~ua.indexOf('msie')) {
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI
    }
  } else if (window.outerWidth != undefined && window.innerWidth != undefined) {
    ratio = window.outerWidth / window.innerWidth
  }
  if (ratio) {
    ratio = Math.round(ratio * 100)
  }
  return ratio
}
//笔记本 系统默认系统比例为150%带来的布局影响。
const m = detectZoom();
document.body.style.zoom = 100 / Number(m);


/* eslint-disable no-new */

const vueInstance = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");

export { vueInstance };
// export default new Vue({
//   el: '#app',
//   router,
//   store,
//   i18n,
//   components: { App },
//   template: '<App/>'
// })
