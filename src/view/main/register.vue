<template>
  <div>
    <p>{{userData.username}}</p>
    <p>{{$route.params}}</p>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex">
          <el-radio label="M">男</el-radio>
          <el-radio label="W">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="介绍人">
        <el-input v-model="form.introducer"></el-input>
      </el-form-item>
      <el-form-item>
        <div v-if="this.$route.params.seleType=='edit'">
          <el-button type="primary" @click="onEdit">编辑</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="onAdd">添加</el-button>
        </div>
        <div>
          <el-button @click="resetForm('form')">清空</el-button>
        </div>


      </el-form-item>
    </el-form>

  </div>
</template>

<script>

export default {
  data() {
    return {
      form: {
        id:'',
        name: '',
        sex: 'M',
        address:'',
        phone:'',
        introducer:''
      }
    }
  },
  //prop 是子组件用来接受父组件传递过来的数据
  props:['userData'],
  mounted() {
    console.log(this.userData)
/*    var par=this.$route.params;
    if(par.seleType==='edit'){
      this.$data.form.name=par.customerList.id;
      this.$data.form.sex=par.student.STU_SEX;
      this.$data.form.status=par.student.STU_STATUS;
    }*/
  },
  methods: {
    onAdd() {
     /* console.log(this.form);
      var user_id=this.$route.params.user_id;
      var obj=this.form;
      this.$axios.post('/vinda_demo_wx/stu/add',{
        p_name:obj.name,
        p_sex:obj.sex,
        p_status:obj.status,
        p_user_id:user_id
      }).then(response =>{
        console.log(response.data)
        if (response.data)
        {
          alert("添加成功！")
        }else{
          alert("添加失败！！！")
        }
        /!*跳转List*!/
        this.goList();
      })*/
    },
    onEdit() {
     /* var user_id=this.$route.params.user_id;
      var stu_id=this.$route.params.student.STU_ID;
      var obj=this.form;

      this.$axios.post('/vinda_demo_wx/stu/edit',{
        p_stu_id:stu_id,
        p_name:obj.name,
        p_sex:obj.sex,
        p_status:obj.status,
        p_user_id:user_id
      }).then(response =>{
        console.log(response.data)
        if (response.data)
        {
          alert("编辑成功！")
        }else{
          alert("编辑失败！！！")
        }
        /!*跳转List*!/
        this.goList();
      })*/
    },
    resetForm(value) {
      this.$refs[value].resetFields();
    }
  }
}
</script>

<style scoped>

</style>
