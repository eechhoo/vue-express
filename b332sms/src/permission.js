import router from './router';
import {getUserInfo} from '@/api/login'
router.beforeEach((to,from,next) => {
    const token = localStorage.getItem("b332sms-token");
    console.log(to.path);
    if(!token){
        if(to.path == "/login"){
            next()
        }else if(to.path === "/register"){
            next();
        }else{
            next({path:'/login'})
        }
    }else{
        if(to.path === "/login"){
            next();
        }else if(to.path === "/register"){
            next();
        }else{
            const userInfo = localStorage.getItem("b332sms-user");
            if(userInfo){
                next();
            }else{
                getUserInfo(token).then(response => {
                    const resp = response.data;
                    if(resp.flag){
                        localStorage.setItem("b332sms-user",JSON.stringify(resp.data))
                    }else{
                        next({path:'/login'})
                    }
                })
            }
        }
    }
})