
import CryptoJS from 'crypto-js';
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


// 根据layout 出口的路由配置信息，获取  左侧菜单显示的菜单
util.getLayoutStaticMenus = function (layoutStaticRoutes) {
    const menulist = [];
    layoutStaticRoutes.forEach((route) => {
        // 带type属性的菜单才是二级菜单， 否则是非菜单页面
        if (route.type && route.type == 'menu') {
            const tempMenuObj = {}; //菜单信息
            if (route.children) {
                tempMenuObj.children = util.getLayoutStaticMenus(route.children);
            }
            tempMenuObj.name = route.name; // 菜单名---根据配置的路由名获取
            tempMenuObj.icon = route.icon; // 菜单显示的图标---根据配置的路由图标获取
            menulist.push(tempMenuObj)
        }
    });
    return menulist;
}

export default util;