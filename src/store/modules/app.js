import util from '@/libs/util';
import myStore from '@/libs/myStore';
import { vueInstance } from '@/main';
const app = {
    namespaced: true,
    // vuex中的状态都是响应式的
    state: {
        singkey: '', // 服务端返回的 HmacSHA1   数据传输加密密钥
        token: '', //  请求token(有时效)
        asyncRoutesGetOver: false,  // 异步路由数据是否请求过了
        menuList: [], //左侧菜单数据
        routeTree: [], //完整路由树形关系数据（包含非菜单页面）
        openNames: [], // 展开的 Submenu 的 name 集合  Array
        BreadcrumbItems: [], // 面包屑数据对象(对象  是  matched)
        tabs: [], // tabs标签页
        tabsNameTemp: [], //tabs标签页-- tabs中路由对象name属性的映射
        maxTabsCount: 5, //tab最大的数量
    },
    //通过 store.commit('test',{}) mutations中的同步函数（必须是同步函数） 更改  state中的状态（同步）
    //mutation 都是同步事务
    mutations: {
        test(state, Payload) {
            //通过state访问和修改state中的状态
            // Payload是commit 额外传递的参数
        },
        setSingKey(state, singkeyv) {
            state.singkey = singkeyv;
        },
        setToken(state, tokenv) {
            state.token = tokenv;
        },
        //退出系统,清空必要的数据
        layout(state) {
            sessionStorage.clear();
        },
        setRouteTree(state, routetree) {
            state.routeTree = state.routeTree.concat(routetree);
            console.log('完整路由树形数据', state.routeTree);
        },
        // 设置左侧菜单数据
        setMenuList(state, menulist) {
            state.menuList = state.menuList.concat(menulist);
            console.log('左侧菜单数据', state.menuList);
        },
        // 更新打开的菜单
        updateOpenNames(state, obj) {
            const { type, data } = obj;
            if (type == "openchange") {
                state.openNames = data;
            }
            if (type == 'matched') {
                if (data.length) {
                    // 如果选中的是三级菜单，那么openNames 需要一级菜单+二级菜单
                    state.openNames = [];
                    const matchedLast = data[data.length - 1];
                    //通过  state.routeTree 处理
                    const linkRoutes = util.getLeafs_FromRouteTree(state.routeTree, matchedLast.name);
                    linkRoutes.forEach((route) => {
                        const { name, meta } = route;
                        if (meta.menu) {
                            state.openNames.push(name);
                        }
                    });
                } else {
                    state.openNames = data;
                }
            }
            console.log('openames', state.openNames);
        },
        /**
         * 更新面包屑数据
         * @param {*} state 
         * @param {*} items 
         */
        updateBreadCrumbItems(state, items) {
            state.BreadcrumbItems = [];
            if (items && items.length) {
                const matchedLast = items[items.length - 1];
                //通过  state.routeTree 处理
                const linkRoutes = util.getLeafs_FromRouteTree(state.routeTree, matchedLast.name);
                state.BreadcrumbItems = linkRoutes.slice();
                console.log('面包屑数据', state.BreadcrumbItems);
            }
        },
        //更新tab标签页
        updateTabs(state, routedata) {
            const { type, data } = routedata;
            if (type == 'add') {
                const routename = data.name;
                //刷新，先从缓存中取
                let tabs = myStore.getObj('TABS');
                let tabsnames = myStore.getObj('TABSNAMES');
                if (tabs) {
                    state.tabs = tabs;
                }
                if (tabsnames) {
                    state.tabsNameTemp = tabsnames;
                }
                if (!state.tabsNameTemp.includes(routename)) {
                    if (state.tabs.length > state.maxTabsCount) {
                        vueInstance.$Message.warning(`打开的标签页超过${state.maxTabsCount}个，请关闭一些`);
                        return
                    }

                    //tabs 不存在，  放到tabs中，并且把这个tab置为选中状态
                    state.tabs.push({ ...data, matched: null }); // 把route中的matched去掉
                    state.tabsNameTemp.push(routename);
                }

            } else if (type == 'update') {
                state.tabs = data;
                state.tabsNameTemp = data.map((item) => {
                    return item.name;
                })
            }
            //存放在缓存，防止刷新丢失
            myStore.setObj('TABS', state.tabs);
            myStore.setObj('TABSNAMES', state.tabsNameTemp);
            console.log('tabs数据', state.tabs, state.tabsNameTemp);
        }
    },

    // Action 提交的是 mutation ，而不是直接变更状态
    // Action 可以包含任意异步操作。
    // Action 通过 store.dispatch 方法触发： store.dispatch('asyncTest',{}) 
    actions: {
        asyncTest(context, Payload) {
            // context 和store实例具有相同方法和属性的对象，但不是store实例，因为 Modules 
            //context.commit('test'，{}); // 提交 mutation
        },
    }
}
export default app;

