// 开发环境
const devEnvi={
    token:'http://localhost:3000/token',  //登入模块
    system:"http://localhost:3000/sys", //系统相关
}

// 生产环境
const proEnvi={
    token:'http://localhost:8000/token',  //登入模块
    system:"http://localhost:8000/sys", //系统相关
}

export {devEnvi,proEnvi}