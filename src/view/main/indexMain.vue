<template>
  <div id="main">
    <el-container>
      <el-header height="200">
        <div class="block">
          <el-image style="height: 100px" :src=imgurl fit="contain"></el-image>
          <span>欢迎用户：{{userData.username}}</span>
        </div>
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
import logo from '../../img/fushuai.jpg'


export default {
  name: 'indexMain',
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
    /*background-color: #615461;*/
  }
 .el-menu {
   background-color: #6f0404;
 }
 .el-menu-item{
   font-weight:bold;
   color: #f3eaea;
 }
</style>
