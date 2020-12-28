<template>
  <div id="login main">
    <el-form :model="userForm" :rules="rules" ref="userForm" status-icon label-width="100px" class="demo-ruleForm">
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
        username: [
          { validator: validUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validPassword, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          alert('submit!');
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
