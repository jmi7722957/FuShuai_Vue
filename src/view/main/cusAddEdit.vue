<template>
  <div id="register">
    <p>{{userData.username}}</p>
<!--    <p>{{$route.params}}</p>-->
    <el-form ref="cusForm" :model="form" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio label="M">男</el-radio>
          <el-radio label="W">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="介绍人" prop="introducer">
        <el-input v-model="form.introducer"></el-input>
      </el-form-item>
      <el-form-item>
        <div v-if="this.seleType==='edit'">
          <el-button type="primary" @click="onEdit">编辑</el-button>
          <el-button @click="resetForm()">清空</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="onAdd">添加</el-button>
          <el-button @click="resetForm()">清空</el-button>
        </div>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import bus from '../Bus'

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
      },
      seleType:''
    }
  },
  //prop 是子组件用来接受父组件传递过来的数据
  props:['userData'],


  components:{
  },
  mounted() {
    //console.log(Bus);
    //把需要编辑的值填进来
    bus.$on('giveRow',(row)=>{
      //console.log(row);
      this.$data.form=row;
      this.$data.seleType='edit';
    });
    bus.$on('closeReg',this.resetForm);
  },
  methods: {
    onAdd() {
      console.log(this.form);
      this.axios({
        method: 'post',
        url:'http://localhost:8081/customer/add',
        data:{
          p_name:this.form.name,
          p_sex:this.form.sex,
          p_address:this.form.address,
          p_phone:this.form.phone,
          p_introducer:this.form.introducer,
          p_create_person:this.userData.username
        }
      }).then(response =>{
        //console.log(response.data)
        if (response.data===true)
        {
          alert("添加成功！")
          this.resetForm();
        }else{
          alert("添加失败！！！")
        }
      })
    },
    onEdit() {
      //console.log(this.form);
      this.axios({
        method: 'post',
        url:'http://localhost:8081/customer/edit',
        data:{
          p_id:this.form.id,
          p_name:this.form.name,
          p_sex:this.form.sex,
          p_address:this.form.address,
          p_phone:this.form.phone,
          p_introducer:this.form.introducer,
        }
      }).then(response =>{
        //console.log(response.data)
        if (response.data===true)
        {
          alert("修改成功！")
        }else{
          alert("修改失败！！！")
        }
      })
    },
    resetForm() {
      if(this.$refs['cusForm']){
        this.$refs['cusForm'].resetFields();
      }
      this.$data.seleType='add'
    }
  }
}
</script>

<style scoped>

</style>
