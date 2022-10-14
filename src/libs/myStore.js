export default {

    // 设置字符串
    setStr(key, str) {
        sessionStorage.setItem(key, str);
    },
    // 获取字符串
    getStr(key) {
        return sessionStorage.getItem(key);
    },

    // 设置对象
    setObj(key, obj) {
        sessionStorage.setItem(key, JSON.stringify(obj));
    },

    //获取对象
    getObj(key) {
        const jsonStr = sessionStorage.getItem(key);
        return JSON.parse(jsonStr);
    },

    //删除项目
    delStore(key) {
        sessionStorage.removeItem(key);
    },

    //清空store
    clearStore() {
        sessionStorage.clear();
    }

} 