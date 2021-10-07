<template>
  <div class="header">
    <a href="#">
      <img src="@/assets/logo.png" width="25px" class="logo" />
      <span class="title">b332学员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ user.nickname }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">修改密码</el-dropdown-item>
        <el-dropdown-item command="b">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        style="width: 400px"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input v-model="ruleForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { logout } from "@/api/login.js";
import passwordApi from '@/api/password.js'
export default {
  data() {
    var validateOldPass = (rule, value, callback) => {
        passwordApi.checkPwd(this.user.id,value).then(response=>{
          const resp = response.data;
          if(resp.flag){
            callback()
          }else{
            callback(new Error(resp.message))
          }
        })
      };
      var validatePass = (rule, value, callback) => {
        if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      user: JSON.parse(localStorage.getItem("b332sms-user")),
      dialogFormVisible: false,
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        oldPass:[
          {required:true,message:"原始密码不能为空",trigger:"blur"},
          { validator: validateOldPass, trigger: 'blur' }
        ],
        pass:[
          {required:true,message:"新密码不能为空",trigger:"blur"}
        ],
        checkPass:[
          {required:true,message:"确认密码不能为空",trigger:"blur"},
          { validator: validatePass, trigger: 'change' }
        ]
      },
    };
  },
  components: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          passwordApi.updatePwd(this.user.id,this.ruleForm.checkPass).then(response=>{
            const resp = response.data;
            this.$message({
              message:resp.message,
              type:resp.flag?"success":"warning"
            })
            if(resp.flag){
              this.handleLogout();
              this.dialogFormVisible = false;
            }
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleCommand(command) {
      switch (command) {
        case "a":
          this.handlePwd()
          break;
        case "b":
          this.handleLogout()
          break;

        default:
          break;
      }
    },
    handleLogout(){
      logout(localStorage.getItem("b332sms-token")).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              localStorage.removeItem("b332sms-token");
              localStorage.removeItem("b332sms-user");
              this.$router.push("/login");
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
    },
    handlePwd(){
      this.dialogFormVisible = true;
      this.$nextTick(()=>{
        this.$refs["ruleForm"].resetFields()
      })
    }
  },
};
</script>

<style scoped>
.logo {
  vertical-align: middle;
  padding: 0 10px 0 40px;
}
.title {
  color: white;
  position: absolute;
}
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}

</style>