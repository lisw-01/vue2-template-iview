import httpConfig from "@/libs/httpconfig"
export default {
    //获取动态理由数据
    getAsyncRoutes() {
        return httpConfig.http.post(httpConfig.httpModuleMap.system + '/getAsyncRoutes',null)
    }
}