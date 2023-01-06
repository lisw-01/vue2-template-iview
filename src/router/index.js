import Vue from 'vue'
import Router from 'vue-router'
import { staticRoutes, layoutStaticMenus } from './static-routes'
import iView from 'view-design'
import store from '../store/storeconfig'
import mystore from '../libs/myStore';
import app from '../store/modules/app'
Vue.use(Router)


//###########  解决NavigationDuplicated: Avoided redundant navigation to current location: "/login" 重复操作导航问题,在登入页又push({name:'login'}) ########
const RouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
  return RouterPush.call(this, to).catch(err => err)
}
const RouterReplace = Router.prototype.replace
Router.prototype.replace = function replace(to) {
  return RouterReplace.call(this, to).catch(err => err)
}

//路由配置，默认是hash路由
const routeConfig = {
  routes: [
    ...staticRoutes
  ],
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  //vue-router 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。
  mode: 'hash',   //hash  history
}

//创建路由

const createRouter = (routeconfig) => new Router(routeconfig);
const router = createRouter(routeConfig);
console.log('router', router);
//重置路由
function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher
}


//全局前置 路由守卫
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start(); // 页面的加载效果开始（类似pace.js）
  //#########  处理刷新 store中的token， singkey丢失  #############
  const matched = to.matched;
  const routename = to.name;
  if (matched.length > 0) {
    // 放到 layout/index.vue 中的菜单
    if (routename != 'login' && routename != '404') {
      const token = store.state.app.token;
      const localToken = mystore.getStr('token');
      const localSingKey = mystore.getStr('singkey');
      if (!token) {
        //刷新页面
        if (localToken) {
          store.commit("app/setSingKey", localSingKey);  //放入store
          store.commit("app/setToken", localToken);  //放入store
        } else {
          // 未登入
          next('/login');
        }
      }
    }
    next();
  } else {
    next('/404');
  }
  next();



});

// 全局后置钩子
router.afterEach(() => {
  iView.LoadingBar.finish(); //页面加载效果结束
});


// 导出路由模块
export default router

