import Vue from "vue";
import ElementUI from 'element-ui';//组件库
import 'element-ui/lib/theme-chalk/index.css';//样式
import './permission.js'
import App from "./App.vue";
import router from "./router";
// 使用ElementUI
Vue.use(ElementUI);
Vue.config.productionTip = false;
console.log(process.env.VUE_APP_SERVICE_URL);
new Vue({
  
  router,
  render: (h) => h(App),
}).$mount("#app");
