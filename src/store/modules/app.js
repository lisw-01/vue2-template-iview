import router from '@/router/index'
const app = {
    namespaced: true,
    // vuex中的状态都是响应式的
    state: {
        singkey: '', // 服务端返回的 HmacSHA1   数据传输加密密钥
        token: '', //  请求token(有时效)
        asyncRoutesGetOver:false,  // 异步路由数据是否请求过了
        menuList:[], //左侧菜单数据

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
        setMenuList(state,menulist){
            state.menuList = state.menuList.concat(menulist);  // 动态路由获取的菜单需要concat
        },
        // 更新路由数据 ---增加了动态路由
        updataRoutes(state,routes){
            debugger
            //router.addRoutes(routes)
            state.asyncRoutesGetOver = true
        }
    },

    // Action 提交的是 mutation ，而不是直接变更状态
    // Action 可以包含任意异步操作。
    // Action 通过 store.dispatch 方法触发： store.dispatch('asyncTest',{}) 
    actions: {
        asyncTest(context, Payload) {
            // context 和store实例具有相同方法和属性的对象，但不是store实例，因为 Modules 
            //context.commit('test'，{}); // 提交 mutation
        }
    }
}

export default app;

