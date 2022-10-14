import Vue from 'vue'
import Router from 'vue-router'
import { staticRoutes } from './static-routes'
import iView from 'view-design'
import store from '../store/storeconfig'
import mystore from '../libs/myStore';
Vue.use(Router)


//###########  解决NavigationDuplicated: Avoided redundant navigation to current location: "/login" 重复操作导航问题,在登入页又push({name:'login'}) ########
const RouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return RouterPush.call(this, to).catch(err => err)
}
const RouterReplace = Router.prototype.replace
Router.prototype.replace = function replace (to) {
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
  }
}

//创建路由

const createRoute = (routeconfig) => new Router(routeconfig);
const router = createRoute(routeConfig);

//全局前置 路由守卫
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start(); // 页面的加载效果（类似pace.js）
  //#########  处理刷新 store中的token， singkey丢失  #############
  const url = to.path;
  if (url.indexOf('login') == -1) {
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
        next({
          name: "login"
        });
      }
    }
  }
  //######### 
  next();
});

// 全局后置钩子
router.afterEach(() => {
  iView.LoadingBar.finish();
});


// 导出路由模块
export default router

