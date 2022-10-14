import httpConfig from "@/libs/httpconfig"
export default {
    // 获取signkey
    getSin_Key() {
        return httpConfig.http.get(httpConfig.httpModuleMap.token + '/getSinkey');
    },

    //登入
    login(params) {
        return httpConfig.http.post(httpConfig.httpModuleMap.token + '/login', params);
    }
}