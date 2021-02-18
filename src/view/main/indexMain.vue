<template>
  <div id="main">
    <el-container>
      <el-header height="200">
        <el-row>
          <el-col :span="6">
            <el-image style="height: 100px" :src=imgurl fit="contain"></el-image>
          </el-col>
          <el-col :span="4">
            <el-image src="/static/image/头像.jpg" style="height: 100px"></el-image>
            <span>欢迎用户：{{userData.username}}</span>
          </el-col>
          <el-col :span="4">
            <QQMusic id="music"></QQMusic>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-menu
          mode="horizontal"
          :router=true>       <!-- router开启index跳转模式 -->
          <el-menu-item index="/list">客户管理</el-menu-item>
          <el-menu-item index="/order">订单管理</el-menu-item>
        </el-menu>

        <router-view v-bind:userData="userData"></router-view>

      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>

</template>

<script>
import logo from '../../resources/fushuai.jpg'
import QQMusic from "../../QQSpace/Main/QQMusic";

export default {
  name: 'indexMain',
  components: {QQMusic},
  data(){
    return {
      userData:{
        username:'',
        annotation:'',
        id:''
      },
      imgurl:logo
    }
  },
  props:['QQMusic'],
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
        this.userData = this.$route.params
      }
      if (this.userData.username===''){
        this.$message.warning('您未登陆')
        this.$router.push('login');
      }else {
      }
    }
  }
}
</script>

<style scoped>
 #main{
    /*background-color: #2b2b2b;*/
  }
 #music{
   height: 100px;
 }
 .el-menu {
   background-color: #6f0404;
 }
 .el-menu-item{
   font-weight:bold;
   color: #f3eaea;
 }
</style>
