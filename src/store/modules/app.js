import util from '@/libs/util';

const app = {
    namespaced: true,
    // vuex中的状态都是响应式的
    state: {
        singkey: '', // 服务端返回的 HmacSHA1   数据传输加密密钥
        token: '', //  请求token(有时效)
        asyncRoutesGetOver: false,  // 异步路由数据是否请求过了
        menuList: [], //左侧菜单数据， 有菜单之间的关系
        staticRoutes:[], //路由
        openNames: [], // 展开的 Submenu 的 name 集合  Array
        BreadcrumbItems: [], // 面包屑数据对象(对象  是  matched)

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
        // 设置左侧菜单数据
        setMenuList(state, menulist) {
            state.menuList = state.menuList.concat(util.LayoutStaticMenusLink(menulist,null));  // 动态路由获取的菜单需要concat
            console.log('左侧菜单数据',state.menuList);
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
                    const menulist = state.menuList;
                    const mathed0 = data[0];  //一级菜单
                    const mathed1 = data[1]; // 二级菜单，  左侧菜单最多三级
                    menulist.forEach((menu) => {
                        const { name, children } = menu;
                        if (mathed0.name == name) {
                            state.openNames.push(name);
                        }
                        if (children && children.length) {
                            children.forEach((menu2) => {
                                const { name } = menu2;
                                if (mathed1.name == name) {
                                    state.openNames.push(name);
                                }
                            })
                        }
                    })
                } else {
                    state.openNames = data;
                }
            }
        },
        //更新面包屑数据
        updateBreadCrumbItems(state, items) {
            // 保持和左侧菜单树一致 
            if (items && items.length) {
                let temp = [...items];
                const mathed0 = items[0];
                const { name } = mathed0;
                //（左侧菜单，当二级菜单有且只有一个，且该二级菜单下无三级菜单，  二级菜单会提级）
                for (let i = 0; i < state.menuList.length; i++) {
                    const name1 = state.menuList[i].name;
                    const children1 = state.menuList[i].children;
                    if (name == name1) {
                        //判断一级菜单是否只有一个二级菜单，且该二级菜单下无三级菜单
                        if (children1 && children1.length == 1 && !children1[0].children) {
                            temp.shift();
                            break
                        }
                    }
                }
                state.BreadcrumbItems = temp;
            } else {
                state.BreadcrumbItems = [];
            }
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

