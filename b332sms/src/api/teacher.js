import request from '@/utils/request.js'

export default{
    // 获取所有教师列表
    getList(){
        return request({
            url:'/teacher/list',
            method:'get'
        })
    },
    search(page,size,searchMap){
        return request({
            url:'/teacher/list',
            method:"post",
            data:{
                page,
                size,
                searchMap
            }
        })
    },
    // 新增教师
    add(teacher){
        return request({
            url:'/teacher',
            method:'post',
            data:teacher
        })
    },
    // 根据id 查询教师
    getById(id){
        return request({
            url:`/teacher?id=${id}`,
            method:'get'
        })
    },
    // 根据id修改教师信息
    update(teacher){
        return request({
            url:'/teacher',
            method:'put',
            data:teacher
        })
    },
    deleteById(id){
        return request({
            url:'/teacher',
            method:'delete',
            data:{
                id:id
            }
        })
    }
}