import Vue from "vue";
import VueRouter from "vue-router";
import Register from '../views/register'
import Login from '../views/login'
import Layout from '../components/Layout.vue'
import Home from '../views/home'
import Teacher from '../views/teacher'
import Student from '../views/student'
Vue.use(VueRouter);

const routes = [  
  {
    path:"/",
    name:'layout',
    component:Layout,
    redirect:'/home',
    children:[
      {
        path:"/home",
        component:Home,
        meta:{title:'首页'}
      }
    ]
  },
  {
    path:'/teacher',
    component:Layout,
    children:[
      {
        path:"/",
        component:Teacher,
        meta:{
          title:'教师管理'
        }
      }
    ]
  },
  {
    path:'/student',
    component:Layout,
    children:[
      {
        path:"/",
        component:Student,
        meta:{
          title:'学员管理'
        }
      }
    ]
  },


  {
    path:'/register',
    name:'register',
    component:Register
  }, 
  {
    path:'/login',
    name:'login',
    component:Login
  },
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
