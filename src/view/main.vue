<template>
  <div id="main">
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <el-menu
          mode="horizontal"
          background-color="#545c64">
          <el-menu-item> <router-link to="/list">list</router-link></el-menu-item>
          <el-menu-item> <router-link to="/test">test</router-link></el-menu-item>
        </el-menu>
        <router-view></router-view>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'main',
  data(){
    return {
      userList:{
        username:'',
        annotation:''
      }
    }
  },
  created () {
    this.getUser()
  },
  methods:{
    goBack:function (){
      this.$router.go(-1);
    },
    getUser:function (){
      //有值传过来才传参
      if (this.$route.params.username!==undefined)
      {
        this.userList = this.$route.params
      }
      if (this.userList.username===''){
        alert('您未登录');
        this.$router.push('login');
      }else {
      }
    }
  }
}
</script>

<style scoped>

</style>
