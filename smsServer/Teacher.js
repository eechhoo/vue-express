const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/b332stu');
// 规则对象
var Schema = mongoose.Schema;
var userSchema = new Schema({
    // 工号
    jobnumber:{
        type:String,
        required:true
    },
    // 姓名
    name:{
        type:String,
        required:true
    },
    // 角色
    role:{
        type:String,
        required:true
    },
    // 入职时间
    entrydate:{
        type:String,
        required:true
    },
    // 电话号码
    phone:{
        type:String,
        required:true
    },
})
module.exports = mongoose.model('Teacher',userSchema);

