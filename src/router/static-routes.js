import util from '@/libs/util';

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
}]

// 放在路由出口  layout/index.vue 中的
//1--菜单页面，需要增加type=menu 来说明
//2--非菜单页面
// 左侧菜单 和 content-tabs 需要显示这部分的信息
const layoutRoutes = [{
    path: '/layout',
    name: 'layout',
    title:"首页",
    icon: 'logo-windows',
    type: "menu",
    component: () => import('../views/layout/index.vue'),
    children: [{
        path: '/echarts',
        name: 'echarts',
        title: "echarts图表2",
        icon: 'ios-pie',
        type: "menu",
        component: () => import('../views/about-echarts/index.vue')
    },{
        path: '/html',
        name: 'html',
        title: "关于html",
        icon: 'ios-pie',
        type: "menu",
        component: () => import('../views/about-html/index.vue')
    }],
}];


const staticRoutes = [...appRoutes,...layoutRoutes];   //静态路由数据, app出口+ layout出口
const layoutStaticMenus = util.getLayoutStaticMenus(layoutRoutes);  // 根据 layout出口的静态路由信息，获取 左侧菜单数据
export { staticRoutes, layoutStaticMenus };