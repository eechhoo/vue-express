var express = require("express");
var md5 = require("blueimp-md5");
var User = require("./User.js");
var Teacher = require("./Teacher.js");
var Student = require("./Student.js");
var router = express.Router();
// 注册
router.post("/user/register",function(req,res){
    var body = req.body;
    User.find({
        $or:[
            {
                username:body.username
            },
            {
                nickname:body.nickname
            }
        ]
    },function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error'
            })
        }
        if(data.length !== 0){
            return res.status(200).json({
                code:4000,
                flag:false,
                message:'账号或昵称已存在'
            })
        }
        body.token = md5(md5(body.username) + "buka");
        new User(body).save(function(err,data){
            if(err){
                return res.status(500).json({
                    code:3000,
                    flag:false,
                    message:'server error,存储失败'
                })
            }
            return res.status(200).json({
                code:2000,
                flag:true,
                message:'注册成功'
            })
        })
    })
})
// 登录
router.post("/user/login",function(req,res){
    var body = req.body;
    User.findOne({
        username:body.username,
        password:body.password
    },function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error login'
            })
        }
        if(!data){
            return res.status(200).json({
                code:4000,
                flag:false,
                message:'账号或密码不存在'
            })
        }
        return res.status(200).json({
            "code":2000,
            "flag":true,
            "message":'登录成功',
            "data":{
                token:data.token
            }
        })
    })
})
// 获取用户信息
router.get("/user/info",function(req,res){
    var body = req.query;
    User.findOne({
        token:body.token
    },function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error getUserInfo'
            })
        }
        if(!data){
            return res.status(200).json({
                code:4000,
                flag:false,
                message:'token已过期'
            })
        }
        return res.status(200).json({
            "code":2000,
            "flag":true,
            "message":'获取用户星系成功',
            "data":{
                "nickname":data.nickname,
                "id":data._id,
            }
        })
    })
})
// 退出登录
router.post("/user/logout",function(req,res){
    var body = req.body;
    User.findOne({
        token:body.token
    },function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error'
            })
        }
        if(!data){
            return res.status(200).json({
                code:4000,
                flag:false,
                message:'token不存在或以过期'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'退出成功'
        })
    })
})
// 获取所有教师列表
router.get("/teacher/list",function(req,res){
    Teacher.find({},function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error'
            })
        }
        let count = data.length;
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'查询成功',
            data:{
                "total":count,
                "rows":data
            }
        })
    })
})

// 获取教师列表，带分页的
router.post("/teacher/list",function(req,res){
    let page = req.body.page || 1;
    let size = req.body.size || 10;
    // 前台传入的查询条件
    let searchMap = req.body.searchMap || {};
    let obj = {};//真正的查询条件
    searchMap.jobnumber ? obj["jobnumber"] = searchMap.jobnumber : obj;
    searchMap.name ? obj["name"] = searchMap.name : obj;
    searchMap.role ? obj["role"] = searchMap.role : obj;
    searchMap.entrydate ? obj["entrydate"] = searchMap.entrydate : obj;
    Teacher.find(obj,function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error'
            })
        }
        let count = data.length;
        // skip:跳过多少条数据，limit：要查询出来多少条数据，exec：前面的都执行完毕再执行的方法里面可以写回调
        Teacher.find(obj).skip((page-1)*parseInt(size)).limit(parseInt(size)).exec(function(err,data){
            if(err){
                return res.status(500).json({
                    code:3000,
                    flag:false,
                    message:'server error'
                })
            }
            return res.status(200).json({
                code:2000,
                flag:true,
                message:'查询成功',
                data:{
                    "total":count,
                    "rows":data
                }
            })
        })
    })
})
// 新增教师
router.post("/teacher",function(req,res){
    new Teacher(req.body).save(function(err){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'新增教师失败'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'新增教师成功'
        })
    })
})
// 根据id查询教师
router.get("/teacher",function(req,res){
    Teacher.findById(req.query.id,function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'根据id查询教师失败'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'根据id查询教师成功',
            data:data
        })
    })
})
// 根据id 修改教师信息
router.put("/teacher",function(req,res){
    var id = req.body._id;
    Teacher.findByIdAndUpdate(id,req.body,function(err){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'根据id修改教师信息失败'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'根据id修改教师信息成功'
        })
    })
})

// 根据id删除教师
router.delete("/teacher",function(req,res){
    Teacher.findByIdAndRemove(req.body.id,function(err){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'根据id删除教师信息失败'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'根据id删除教师信息成功'
        })
    })
})

// 获取学生列表，带分页的
router.post("/student/list",function(req,res){
    let page = req.body.page || 1;
    let size = req.body.size || 10;
    // 前台传入的查询条件
    let searchMap = req.body.searchMap || {};
    let obj = {};//真正的查询条件
    searchMap.stunum ? obj["stunum"] = searchMap.stunum : obj;
    searchMap.name ? obj["name"] = searchMap.name : obj;
    searchMap.admissiondate ? obj["admissiondate"] = searchMap.admissiondate : obj;
    searchMap.teacher ? obj["teacher"] = searchMap.teacher : obj;
    searchMap.teacherId ? obj["teacherId"] = searchMap.teacherId : obj;
    searchMap.class ? obj["class"] = searchMap.class : obj;
    Student.find(obj,function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error'
            })
        }
        let count = data.length;
        // skip:跳过多少条数据，limit：要查询出来多少条数据，exec：前面的都执行完毕再执行的方法里面可以写回调
        Student.find(obj).skip((page-1)*parseInt(size)).limit(parseInt(size)).exec(function(err,data){
            if(err){
                return res.status(500).json({
                    code:3000,
                    flag:false,
                    message:'server error'
                })
            }
            return res.status(200).json({
                code:2000,
                flag:true,
                message:'查询成功',
                data:{
                    "total":count,
                    "rows":data
                }
            })
        })
    })
})
// 新增学生
router.post("/students",function(req,res){
    console.log(req.body);
    new Student(req.body).save(function(err){
        console.log(err);
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'新增学生失败'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'新增学生成功'
        })
    })
})
// 根据id查询学生
router.get("/students",function(req,res){
    Student.findById(req.query.id,function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'根据id查询教师失败'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'根据id查询教师成功',
            data:data
        })
    })
})
// 根据id 修改学生信息
router.put("/students",function(req,res){
    var id = req.body._id;
    Student.findByIdAndUpdate(id,req.body,function(err){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'根据id修改教师信息失败'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'根据id修改教师信息成功'
        })
    })
})

// 根据id删除学生
router.delete("/students",function(req,res){
    Student.findByIdAndRemove(req.body.id,function(err){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'根据id删除教师信息失败'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'根据id删除教师信息成功'
        })
    })
})

// 校验密码是否正确
router.post("/user/pwd",function(req,res){
    var body = req.body;
    User.findOne({
        _id:body.userId,
        password:body.password
    },function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                message:'校验密码是否正确，服务器错误',
                flag:false
            })
        }
        if(!data){
            return res.status(200).json({
                code:4000,
                message:'密码不正确',
                flag:false
            })
        }
        return res.status(200).json({
            code:2000,
            message:'密码正确',
            flag:true
        })
    })
})
// 修改密码
router.put("/user/pwd",function(req,res){
    var id = req.body.userId;
    User.findOne({
        _id:id
    },function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                message:'修改密码校验，服务器错误',
                flag:false
            })
        }
        if(!data){
            return res.status(200).json({
                code:4000,
                message:'密码不正确',
                flag:false
            })
        }
        data.password = req.body.password;
        User.findByIdAndUpdate(id,data,function(err){
            if(err){
                return res.status(500).json({
                    code:3000,
                    message:'修改密码，服务器错误',
                    flag:false
                })
            }
            return res.status(200).json({
                code:2000,
                message:'密码修改成功',
                flag:true
            })
        })
    })

})

module.exports = router;