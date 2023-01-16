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
const layoutStaticRoutes = [{
    path: '/A',
    name: 'A',
    meta: {
        title: "A",
        icon: 'md-desktop',
        menu: true
    },
    component: () => import('../views/layout/index.vue'),  //二级菜单的路由出口
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
        //二级菜单下 非菜单页面,   放到路由出口 layout/index.vue 中
        path: '/A-a-add',
        name: 'A-a-add',
        meta: {
            title: "A-a-add",
            icon: 'ios-pie',
            menu: false,
            parenRoutetName: 'A-a'
        },
        component: () => import('../views/A/A-a/A-a-add/index.vue')
    }],
}, {
    path: '/B',
    name: 'B',
    meta: {
        title: 'B',
        icon: 'md-bookmarks',
        menu: true
    },
    component: () => import('../views/layout/index.vue'),  //二级菜单的路由出口
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
    component: () => import('../views/layout/index.vue'),  //二级菜单的路由出口
    children: [{
        path: '/C-a',
        name: 'C-a',
        meta: {
            title: 'C-a',
            icon: "ios-pie",
            menu: true
        },
        component: () => import("../views/C/C-a/index.vue"), //三级菜单的路由出口
        children: [{
            path: '/C-a-1',
            name: "C-a-1",
            meta: {
                title: 'C-a-1',
                icon: "ios-pie",
                menu: true
            },
            component: () => import('../views/C/C-a/C-a-1/index.vue')
        }, {
            //三级菜单下非菜单页面   放到对应的三级菜单的路由出口中
            path: '/C-a-1-add',
            name: "C-a-1-add",
            meta: {
                title: 'C-a-1-add',
                icon: "ios-pie",
                menu: false,
                parenRoutetName: 'C-a-1'
            },
            component: () => import('../views/C/C-a/C-a-1/C-a-1-add')
        }]
    }]
}];


const staticRoutes = [...appRoutes, ...layoutStaticRoutes];   //静态路由数据, app出口+ layout出口
export { staticRoutes, layoutStaticRoutes };