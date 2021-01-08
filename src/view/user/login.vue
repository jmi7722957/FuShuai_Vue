<template>
  <div>
    <el-form :model="userForm" :rules="rules" ref="userForm" status-icon label-width="100px" class="login">
      <el-form-item label="账号" prop="username">
        <el-input type="text" v-model="userForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="userForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('userForm')">提交</el-button>
        <el-button @click="resetForm('userForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/*后端交互*/

export default {

  name: 'login',
  data() {
    var validUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('账号不能为空'));
      } else {
        callback();
      }
    };
    var validPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'));
      } else {
        callback();
      }
    };
    return {
      userForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [     //validator验证器trigger触发
          { validator: validUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validPassword, trigger: 'blur' }
        ]
      },
    };
  },
  methods: {
    submitForm(value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          //使用post请求，属性要用data,使用get才是params
          this.axios({
            method: 'post',
            url: 'http://localhost:8081/user/login',
            data:{
              p_username:this.userForm.username,
              p_password:this.userForm.password
            }
          }).then(response=> {
            if(response.data)
            {
              //console.log(response.data);
              var username = response.data.username
              var annotation = response.data.annotation
              this.$router.push({name:'main',params:{username:username,annotation:annotation}})
              //this.$router.replace('/login') //替代,url
            }else{
              alert("登录失败");//跳转,name
            }
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(value) {
      this.$refs[value].resetFields();
    }
  }
}
</script>

<style scoped>

</style>
