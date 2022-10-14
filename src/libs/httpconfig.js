import Axios from "axios";
import { devEnvi, proEnvi } from "../environment";
import { vueInstance } from '../main';
const hConfig = {
    httpBaseUrl: '', //默认http请求路径
    httpModuleMap: {},  // 不同环境下的服务模块访问路径映射
    http: null,
};
const env = window['$env'] ? window['$env'] : process.env.NODE_ENV
console.log('运行环境', env);

if (env == 'development') {
    hConfig.httpBaseUrl = devEnvi.token;
    hConfig.httpModuleMap = devEnvi;
} else if (env == 'production') {
    hConfig.httpBaseUrl = proEnvi.token;
    hConfig.httpModuleMap = proEnvi;
}
//创建http实例
hConfig.http = Axios.create({
    baseURL: hConfig.httpBaseUrl,
    timeout: 30000,
    withCredentials: false   // 如果配置了withCredentials=true，(要求请求头里带上cookie),后段设置Access-Control-Allow-Origin不能为 " * "[因为请求头携带cookie],必须是源地址
})
// http请求拦截器

hConfig.http.interceptors.request.use((config) => {
    const url = config.url;
    const basereqobj = config.data;  // post的请求体
    const reqobj = (basereqobj === null) ? {} : basereqobj;
    if (url.indexOf('token/getSinkey') == -1) {
        //请求sinkey的接口，不需要对参数加密
        //请求sinkey的接口，不需要token校验
        //####除了 请求sinkey的接口，都需要对请求参数加密
        const sinkey_ = vueInstance.$store.state.app.singkey;
        config.headers['xc_client_sessionid'] = sinkey_;
        config.headers['Content-Signature'] = vueInstance.$util.getSignReqobj(sinkey_, JSON.stringify(reqobj));
        if (url.indexOf("token/login") == -1) {
            //登入接口（获取token)，不需要token校验
            //########除了 登入接口， 都需要token校验
            const access_token = vueInstance.$store.state.app.token;
            config.headers['xc_sso_sessionid'] = access_token;
            config.headers['Authorization'] = `Bearer ${access_token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

//http响应拦截器
hConfig.http.interceptors.response.use((resp) => {
    const httpstatus = resp.status;
    if (httpstatus === 200) {
        // http 请求状态码是 200
        const respbody = resp.data;
        const { status, data } = respbody;
        // fail_change   fail_express  后端没有模拟相应的状态码，放到 httpstatus =200 中
        if (status == "fail_change") {
            //请求内容被篡改后端没模拟状态码
            vueInstance.$router.push({
                name: 'login'
            });
        } else if (status == "fail_express") {
            //token失效后端没模拟状态码
            vueInstance.$router.push({
                name: 'login'
            });
        } else {
            // success 或者 fail
            return respbody;  //  then((resp))
        }
    }
    return resp;
}, (error) => {
    //app-server 没有模拟失败的状态码，此处需要根据具体项目后台的约定做调整
    if (error.response) {
        switch (error.response.status) {
            case 401:
                // 未授权，请求要求身份认证
                if (vueInstance.$route.name != 'login') {
                    vueInstance.$Message.warning({
                        content: '身份认证失效，请重新登入',
                        duration: 5, //单位秒
                        onClose: () => {
                            vueInstance.$router.push({
                                name: "login"
                            })
                        }
                    })
                } else {
                    return Promise.reject(error);
                }
                break;
            case 403:
                // 禁止， 服务器拒绝请求
                vueInstance.$Message.warning({
                    content: error.response.data.message,
                    duration: 5
                });
                return Promise.reject(error);
                break;
            default:
                return Promise.reject(error);
                break
        }

    } else if (error.message) {
        if (error.message == "Network Error") {
            vueInstance.$Message.error({
                content: '网络错误',
                duration: 5
            });
        } else if (error.message.indexOf('timeout')) {
            vueInstance.$Message.error("网络超时");
        } else {
            vueInstance.$Message.error(error.message);
        }
        return Promise.reject(error);

    } else {
        return Promise.reject(error);
    }
});
export default hConfig;