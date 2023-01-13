
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
 * @param {*} aysncRoutes 
 * @param {*} PID 
 * @returns 
 */
util.toStaticRoutes = function (aysncRoutes, PID) {
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
                menu: menu
            }
            temp.component = () => import(`@/views/${componentPath}`);  // 异步加载的路由，需要 插件  babel-plugin-syntax-dynamic-import 支持
            const children = util.toStaticRoutes(aysncRoutes, id);
            if (children.length) {
                temp['children'] = children;
            }
            asyncRouteRtree.push(temp);
        }
    })
    return asyncRouteRtree
}
/**
 * 静态路由数据。转化为左侧菜单数据  【非菜单页面 menu=false，不会在菜单数据中】
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

util.LayoutStaticMenusLink = function (staticMenus, parentMenuName) {
    const menulistLink = [];
    staticMenus.forEach((menu) => {
        const { name, title, icon } = menu;
        //是菜单
        const tempMenuObj = {}; //菜单信息
        if (menu.children) {
            tempMenuObj.children = util.LayoutStaticMenusLink(menu.children, name);
        }
        tempMenuObj.name = name;
        tempMenuObj.title = title;
        tempMenuObj.icon = icon;
        if (parentMenuName) {
            tempMenuObj.parentMenuName = parentMenuName
        }
        menulistLink.push(tempMenuObj)
    });
    return menulistLink;
}

/**
 * 根据叶子节点名称【唯一的】。从树形数据中找到该叶子节点的根节点
 */
util.getLeaf = function (tree, leafname) {
    let leaf;
    const tableDatas = util.getTableData(tree);
    for (let i = 0; i < tableDatas.length; i++) {
        const d = tableDatas[i];
        if (leafname == d.name) {
            leaf = d;
            if (d.parentMenuName) {
                leaf = util.getLeaf(tree, d.parentMenuName)
            }
        }
    }
    return leaf;
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