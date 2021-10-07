import axios from 'axios';
import {Loading,Message } from 'element-ui'
// axios.get("/db.json").then(response => {
//     console.log(response.data);
// })
/* axios({
    method:"get",
    url:"/db.json"
}).then(response=>{
    console.log(response.data);
}) */
const loading = {
  loadingInstance :null,//Loading实例
  open:function(){
    if(this.loadingInstance === null){
      this.loadingInstance = Loading.service({
        text:'拼命加载中...',
        target:'.main',
        background:'rgba(0,0,0,0.5)'
      })
    }
  },
  close:function(){
    if(this.loadingInstance !== null){
      this.loadingInstance.close()
    }
    this.loadingInstance = null;
  }

}

const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    // baseURL: '/',
    timeout: 5000
});

// 设置请求拦截器
request.interceptors.request.use(function (config) {
    // 请求拦截
    loading.open()
    return config;
  }, function (error) {
    // 出现异常，抛出
    loading.close();
    return Promise.reject(error);
  });

// 响应拦截器
request.interceptors.response.use(function (response) {
    const resp = response.data;
    if(resp.code !== 2000){
      Message({
        message:resp.message || '系统异常',
        type:'warning',
        duration:5*1000
      })
    }

    // 响应拦截
    loading.close()
    return response;
  }, function (error) {

    loading.close()
    Message({
      message:error.message,
      type:'error',
      duration:5*1000
    })
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

// request({
//     method:"get",
//     url:"/db.json"
// }).then(response=>{
//     console.log(response.data);
// })

export default request;