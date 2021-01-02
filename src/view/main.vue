<template>
  <div>
    <el-container>
      <el-header height="200">
        <div class="block">
<!--          <img  id="imghead" src="../img/fushuai.jpg" height="80px">-->
          <el-image style="height: 100px" :src=imgurl fit="contain"></el-image>
          <span>欢迎用户：{{userData.username}}</span>
        </div>
      </el-header>
      <el-main>
        <el-menu
          mode="horizontal"
          background-color="Black"
          :router=true>       <!-- router开启index跳转模式 -->
          <el-menu-item index="/list">list</el-menu-item>
          <el-menu-item index="/test">test</el-menu-item>
        </el-menu>

        <router-view v-bind:userData="userData"></router-view>

      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>

</template>

<script>
import logo from  '../img/fushuai.jpg'

export default {
  name: 'main',
  data(){
    return {
      userData:{
        username:'root',
        annotation:'城主',
        id:'1'
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
