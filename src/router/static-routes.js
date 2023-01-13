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
//1--菜单页面，需要增加  menu =true 来说明
//2--非菜单页面   menu= false
// 左侧菜单 和 content-tabs 需要显示这部分的信息
const layoutRoutes = [{
    path: '/A',
    name: 'A',
    meta: {
        title: "A",
        icon: 'md-desktop',
        menu: true
    },
    component: () => import('../views/layout/index.vue'),
    children: [{
        path: '/A-a',
        name: 'A-a',
        meta: {
            title: "A-a",
            icon: 'ios-pie',
            menu: true
        },
        component: () => import('../views/A/A-a/index.vue')
    }, {
        //二级菜单 非菜单页面
        path: '/A-b',
        name: 'A-b',
        meta: {
            title: "A-b",
            icon: 'ios-pie',
            menu: false
        },
        component: () => import('../views/A/A-b/index.vue')
    }],
}, {
    path: '/B',
    name: 'B',
    meta: {
        title: 'B',
        icon: 'md-bookmarks',
        menu: true
    },
    component: () => import('../views/layout/index.vue'),
    children: [{
        path: '/B-a',
        name: 'B-a',
        meta: {
            title: "B-a",
            icon: 'ios-pie',
            menu: true
        },
        component: () => import('../views/B/B-a/index.vue')
    }, {
        path: '/B-b',
        name: 'B-b',
        meta: {
            title: "B-b",
            icon: 'ios-pie',
            menu: true
        },
        component: () => import('../views/B/B-b/index.vue')
    }]
}, {
    path: '/C',
    name: 'C',
    meta: {
        title: 'C',
        icon: 'md-bookmarks',
        menu: true
    },
    component: () => import('../views/layout/index.vue'),
    children: [{
        path: '/C-a',
        name: 'C-a',
        meta: {
            title: 'C-a',
            icon: "ios-pie",
            menu: true
        },
        component: () => import("../views/C/C-a/index.vue"),
        children: [{
            path: '/C-a-1',
            name: "C-a-1",
            meta: {
                title: 'C-a-1',
                icon: "ios-pie",
                menu: true
            },
            component: () => import('../views/C/C-a/C-a-1/index.vue')
        },{
            //三级菜单是非菜单数据
            path: '/C-a-2',
            name: "C-a-2",
            meta: {
                title: 'C-a-2',
                icon: "ios-pie",
                menu: false
            },
            component: () => import('../views/C/C-a/C-a-2/index.vue')
        }]
    }]
}];


const staticRoutes = [...appRoutes, ...layoutRoutes];   //静态路由数据, app出口+ layout出口
const layoutStaticMenus = util.getLayoutStaticMenus(layoutRoutes);  // 根据 layout出口的静态路由信息，获取 左侧菜单数据
export { staticRoutes, layoutStaticMenus };