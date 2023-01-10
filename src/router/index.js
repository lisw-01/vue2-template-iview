import Vue from 'vue'
import Router from 'vue-router'
import { staticRoutes, layoutStaticMenus } from './static-routes'
import iView from 'view-design'
import store from '../store/storeconfig'
import mystore from '../libs/myStore';
import app from '../store/modules/app'
import util from '@/libs/util';

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

const createRouter = (routeconfig) => {
  return new Router(routeconfig)
};
const router = createRouter(routeConfig);
console.log('router', router);
//重置路由
// function resetRouter() {
//   const newRouter = createRouter();
//   router.matcher = newRouter.matcher  //替换现有 router的 routes
// }

//全局前置 路由守卫
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start(); // 页面的加载效果开始（类似pace.js）
  //#########  处理刷新 store中的token， singkey丢失  #############
  const matched = to.matched;  //匹配的路由数组,  左侧菜单设计只支持3级， 所有这里最多是3个
  const routename = to.name;  //路由名称，唯一的
  if (!matched || !matched.length) {
    next('/404');
  } else {
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
    } else {
      if (routename == 'login') {
        // 无论是 token失效， 退出，等回到登入页，都按退出处理
        store.state.app.asyncRoutesGetOver = false;
        store.state.app.menuList = [];
        store.state.app.openNames = [];
      }
    }
    //处理右侧菜单
    getComponentName(matched[0]).then((componentName) => {
      //路由出口在 layout/index.vue
      if (componentName == 'layout' && !store.state.app.asyncRoutesGetOver) {
        store.commit('app/setMenuList', layoutStaticMenus || []);
        store.commit('app/updateOpenNames', { type: 'matched', data: matched });
        //添加动态路由
        util.getAsyncRoutes().then((resp) => {
          const aysRoutesTree = util.toStaticRoutes(resp, '-1');
          aysRoutesTree.forEach(v => {
            v.children = routerChildren(v.children);
            v.component = routerCom(v.component);
            console.log(v);
            router.addRoute(v); //添加,  添加完路由还会重复执行一遍路由守卫
          });
          store.state.app.asyncRoutesGetOver = true;
          //左侧菜单更新(动态路由部分)
          store.commit('app/setMenuList', util.getLayoutStaticMenus(aysRoutesTree));
          next({
            ...to, // next({ ...to })的目的,是保证路由添加完了再进入页面 (可以理解为重进一次)
            replace: true, // 重进一次, 不保留重复历史
          })
        }, (err) => {
          next();
        })
      } else {
        next();
      }
    }, (err) => {
      console.error(err);
    })
  }
});


/**
 * 一级菜单的组件一定是 layout/index.vue（带二级菜单的路由出口）
 * 但是一级菜单的  name path title是各子的
**/

function getComponentName(matchedRoute) {
  return new Promise((resolve, reject) => {
    try {
      if (typeof matchedRoute.components.default === 'function') {
        matchedRoute.components.default().then((resp) => {
          //resp.default 就是  layout/index.vue这个组件对象
          resolve(resp.default.name);
        }, (err) => {
          reject(err);
        })
      } else {
        resolve(matchedRoute.components.default.name);
      }
    } catch (error) {
      reject(error)
    }
  });
}

function routerCom(path) { //对路由的component解析
  console.log(`@/views/${path}`)
  return (resolve) =>{
    debugger
    return   require([`@/views/${path}`], resolve)
  };
}

function routerChildren(children) { //对子路由的component解析
  children.forEach(v => {
    v.component = routerCom(v.component);
    if (v.children != undefined) {
      v.children = routerChildren(v.children)
    }
  })
  return children
}

// 全局后置钩子
router.afterEach(() => {
  iView.LoadingBar.finish(); //页面加载效果结束
});


// 导出路由模块
export default router