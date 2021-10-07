module.exports={
    devServer:{
        port:8888,
        host:'localhost',
        https:false,
        open:true,
        proxy:{//开发环境代理
            [process.env.VUE_APP_BASE_API]:{
                // 目标服务器
                target:process.env.VUE_APP_SERVICE_URL,
                changOrigin:true,//开启代理
                pathRewrite:{
                    // 会将/dev-api替换成''
                    ["^"+process.env.VUE_APP_BASE_API]:''
                }
            }
        }
    },
    lintOnSave:false,
    productionSourceMap:false




}
