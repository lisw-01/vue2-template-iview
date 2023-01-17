
import CryptoJS from 'crypto-js';
import api from '@/api';
const util = {
    // 系统中的静态全局变量
    // aes 加解密参数
    key: "7ed0a55691534aa8a9a692d373deeee8",
    iv: "6bSWAnEG/f2onZ7S"
};

/**
 *  aes加密
 * @param {*} s  需要加密的字符串或者json字符串
 */
util.aesString = function (s) {
    const key = CryptoJS.enc.Utf8.parse(this.key);
    const iv = CryptoJS.enc.Utf8.parse(this.iv);
    const encrypted = CryptoJS.AES.encrypt(s, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}
/**
 * aes解密
 * @param {} encrypted  aes加密后的数据
 */
util.daesString = function (encrypted) {
    const key = CryptoJS.enc.Utf8.parse(this.key);
    const iv = CryptoJS.enc.Utf8.parse(this.iv);
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}
/**
 * HmacSHA1 加密
 * @param {} sinkey  ----后端返回的加密参数
 * @param {*} value  ----加密的字符串
 */
util.getSignReqobj = function (sinkey, value) {
    const sha1_result = CryptoJS.HmacSHA1(value, sinkey);
    const result = CryptoJS.enc.Base64.stringify(sha1_result);
    return result;
}


util.getWindowSize = function () {
    return {
        h: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        w: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    }
}




/**
 * 根据服务获取  动态路由数据---表格形式的返回，数据源参看 app-server中的 db.js
 * @returns 
 */
util.getAsyncRoutes = function () {
    return new Promise((resolve, reject) => {
        api.getAsyncRoutes().then((resp) => {
            const { status, data } = resp;
            if (status == 'success') {
                const list = data.list;
                resolve(list);
            }
        }, (err) => {
            reject(err)
        })
    });
}

/**
 * 动态路由（表格形式） 转化为 静态路由（static-routes.js中的数据格式）
 * 
 * @param {*} aysncRoutes 
 * @param {*} PID 
 * @returns 
 */
util.toStaticRoutes = function (aysncRoutes, PID) {
    const ayscRouteTree = util.tableToTree(aysncRoutes, PID, null);
    //处理成 static-routes.js中的静态路由数据格式【主要是处理  非菜单页面】
    const staticRoutes = util.toStaticRoutesHelp(ayscRouteTree);
    return staticRoutes;
}

util.tableToTree = function (aysncRoutes, PID, parenRoutetName) {
    const asyncRouteRtree = [];
    aysncRoutes.forEach((asyncRoute) => {
        const { id, path, name, title, icon, menu, pid, componentPath } = asyncRoute;
        const temp = {};
        if (pid == PID) {
            temp.path = path;
            temp.name = name;
            temp.meta = {
                title: title,
                icon: icon,
                menu: menu,
            }
            if (parenRoutetName) {
                temp.meta['parenRoutetName'] = parenRoutetName;
            }
            temp.component = () => import(`@/views/${componentPath}`);  // 异步加载的路由，需要 插件  babel-plugin-syntax-dynamic-import 支持
            const children = util.tableToTree(aysncRoutes, id, name);
            if (children.length) {
                temp['children'] = children;
            }
            asyncRouteRtree.push(temp);
        }
    })
    return asyncRouteRtree
}

util.toStaticRoutesHelp = function (ayscRouteTree) {
    const staticRoutes = [];
    ayscRouteTree.forEach((node) => {
        const nodeTemp = {
            name: node.name,
            path: node.path,
            meta: { ...node.meta },
            component: node.component
        }

        const { children } = node;
        if (children && children.length) {
            const childrenTemp = [];
            children.forEach((node2) => {
                const node2Temp = {
                    name: node2.name,
                    path: node2.path,
                    meta: { ...node2.meta },
                    component: node2.component
                }
                const children2 = node2.children;
                if (children2 && children2.length) {
                    const children2Temp = [];
                    children2.forEach((node3) => {
                        const node3Temp = {
                            name: node3.name,
                            path: node3.path,
                            meta: { ...node3.meta },
                            component: node3.component
                        }
                        if (!node3.meta.menu) {
                            //二级菜单下的 非菜单页面
                            node3Temp.meta['parenRoutetName'] = node2.name;
                            childrenTemp.push(node3Temp);  //非菜单页面提上去
                        } else {
                            children2Temp.push(node3Temp);
                        }
                        const children3 = node3.children;
                        if (children3 && children3.length) {
                            const children3Temp = [];
                            children3.forEach((node4) => {
                                const node4Temp = {
                                    name: node4.name,
                                    path: node4.path,
                                    meta: { ...node4.meta },
                                    component: node4.component
                                }
                                if (!node4.meta.menu) {
                                    //三级菜单下的  非菜单页面
                                    node4Temp.meta['parenRoutetName'] = node3.name;
                                    children2Temp.push(node4Temp); // 提上去
                                } else {
                                    children3Temp.push(node4Temp);
                                }
                            });
                            if (children3Temp.length) {
                                node3Temp.children = children3Temp;
                            }
                        }
                    });
                    if (children2Temp.length) {
                        node2Temp.children = children2Temp;
                    }
                }
                childrenTemp.push(node2Temp);
            });
            nodeTemp.children = childrenTemp;
        }
        staticRoutes.push(nodeTemp);
    });
    return staticRoutes;
}

// {
//     path: '/A',
//         name: 'A',
//             meta: {
//         title: "A",
//             icon: 'md-desktop',
//                 menu: true
//     },
//     component: () => import('../views/layout/index.vue'),  //二级菜单的路由出口
//         children: [{
//             path: '/A-a',
//             name: 'A-a',
//             meta: {
//                 title: "A-a",
//                 icon: 'ios-pie',
//                 menu: true
//             },
//             component: () => import('../views/A/A-a/index.vue')
//         }, {
//             //二级菜单下 非菜单页面,   放到路由出口 layout/index.vue 中
//             path: '/A-a-add',
//             name: 'A-a-add',
//             meta: {
//                 title: "A-a-add",
//                 icon: 'ios-pie',
//                 menu: false,
//                 parenRoutetName: 'A-a'
//             },
//             component: () => import('../views/A/A-a/A-a-add/index.vue')
//         }],
// }
/**
 * static-routes.js中  路由数据 转换为   完整的路由树形数据
 * @param {} staticRoutes 
 */
util.getRouteTree = function (staticRoutes, parenRoutetName) {
    const treeData = [];
    staticRoutes.forEach((route) => {
        const routeTemp = {
            name: route.name,
            path: route.path,
            meta: { ...route.meta },
            component: route.component
        }
        if (parenRoutetName) {
            routeTemp.meta['parenRoutetName'] = parenRoutetName;
        }

        if (!route.meta.parenRoutetName) {
            const Downgrade = staticRoutes.filter((item) => {
                return item.meta.parenRoutetName && route.name == item.meta.parenRoutetName;
            });
            if (Downgrade.length) {
                routeTemp.children = Downgrade
            }
            treeData.push(routeTemp);
            if (route.children && route.children.length) {
                routeTemp.children = util.getRouteTree(route.children, route.name);
            }
        }
    });

    return treeData;
}

/**
 * 静态路由数据(static-routes.js中  路由数据)。转化为左侧菜单数据  【非菜单页面 menu=false，不会在菜单数据中】
 * @param {*} layoutStaticRoutes 
 * @returns 
 */
util.getLayoutStaticMenus = function (layoutStaticRoutes) {
    const menulist = [];
    layoutStaticRoutes.forEach((route) => {
        // 带type属性的菜单才是二级菜单， 否则是非菜单页面
        const { name, path, meta } = route;
        //是菜单
        if (meta.menu) {
            const tempMenuObj = {}; //菜单信息
            if (route.children) {
                tempMenuObj.children = util.getLayoutStaticMenus(route.children);
            }
            tempMenuObj.name = route.name; //菜单名(用于菜单的name属性)---根据配置的路由的name获取
            tempMenuObj.title = meta.title; //菜单显示名---根据配置的路由title获取
            tempMenuObj.icon = meta.icon; // 菜单显示的图标---根据配置的路由图标获取
            menulist.push(tempMenuObj)
        }
    });
    return menulist;
}



/**
 * 根据叶子节点名称【唯一的】。从树形数据中找到该叶子节点的根节点
 */
util.getLeaf_FromRouteTree = function (tree, leafname) {
    let leaf;
    const tableDatas = util.getTableData(tree);
    for (let i = 0; i < tableDatas.length; i++) {
        const d = tableDatas[i];
        if (leafname == d.name) {
            leaf = d;
            if (d.meta['parenRoutetName']) {
                leaf = util.getLeaf_FromRouteTree(tree, d.meta['parenRoutetName'])
            }
        }
    }
    return leaf;
}
/**
 * 根据叶子节点名称【唯一的】。从树形数据中找到该叶子节点的向上路径
 */

util.getLeafs_FromRouteTree = function (tree, leafname) {
    let leafs = [];
    const tableDatas = util.getTableData(tree);
    for (let i = 0; i < tableDatas.length; i++) {
        const d = tableDatas[i];
        if (leafname == d.name) {
            leafs = [d];
            if (d.meta['parenRoutetName']) {
                leafs = util.getLeafs_FromRouteTree(tree, d.meta['parenRoutetName']).concat(leafs);
            }
        }
    }
    return leafs;
}

util.getNode_FromRouteTree = function (tree, nodename) {
    let node;
    const tableDatas = util.getTableData(tree);
    for (let i = 0; i < tableDatas.length; i++) {
        const d = tableDatas[i];
        if (nodename == d.name) {
            node = d;
        }
    }
    return node;
}


util.getTableData = function (tree) {
    let table = [];
    tree.forEach((obj) => {
        table.push({ ...obj });
        if (obj.children && obj.children.length) {
            const temp = util.getTableData(obj.children);
            table = table.concat(temp)
        }
    })
    return table;
}

export default util;