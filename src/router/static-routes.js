
// 放在路由出口 app.vue中的 
const appRoutes = [{
    path: '',
    redirect: '/login'
}, {
    path: "/login",
    name: 'login',
    props: true, // $route和 路由解耦
    meta: {
        keepAlive: false
    },
    component: () => import("../views/login")
}, {
    path: "/404",
    name: '404',
    component: () => import("../views/404")
}, {
    path: "/layout",
    name: 'layout',
    component: () => import("../views/layout")
}]

// 放在路由出口  layout/index.vue 中的
const mainRoutes = [];


const staticRoutes = [...appRoutes, ...mainRoutes];
export { staticRoutes };