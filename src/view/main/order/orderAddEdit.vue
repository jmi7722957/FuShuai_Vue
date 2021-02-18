<template>
  <div id="orderAddEdit">
    <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="80px">
      <el-form-item label="客户ID" prop="customerId">
        <el-input v-model="addForm.customerId"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="orderAddress">
        <el-input v-model="addForm.orderAddress"></el-input>
      </el-form-item>
      <el-form-item label="定金" prop="deposit">
        <el-input v-model="addForm.deposit"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="addForm.remarks"></el-input>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import bus from "../../Bus"
export default {
  name: "orderAddEdit",
  data(){
    var validNull = (rule, value, callback) => {
      if(value===''){
        callback(new Error('不能为空'));
      }else {
        callback();
      }
    };
    return{
      addForm:{
        customerId:'',
        orderAddress:'',
        deposit:'',
        totalMoney:'',
        returnMoney:'',
        endMoney:'',
        remarks:''
      },
      rules: {
        customerId: [
          { validator: validNull, trigger: ['blur','change']}
        ],
        orderAddress: [
          { validator: validNull, trigger: ['blur','change']}
        ],
        deposit: [
          { validator: validNull, trigger: ['blur','change']}
        ],
        remarks: [
          { validator: validNull, trigger: ['blur','change']}
        ]
      }
    }
  },
  props:['userData'],
  mounted() {
    bus.$on('clearOrderForm',this.resetForm);
    bus.$on('BusAddOrder',this.addOrder);
  },
  methods:{
    resetForm() {
      if(this.$refs['addForm']){
        this.$refs['addForm'].resetFields();
      }
    },
    addOrder(){
      //先验证通过才执行
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.axios.post(
              this.httpUrl.url+'/order/add',
              {
                    'p_userName':this.userData.username,
                    'p_customerId':this.addForm.customerId,
                    'p_orderAddress':this.addForm.orderAddress,
                    'p_deposit':this.addForm.deposit,
                    'p_remarks':this.addForm.remarks,
          }).then(response=>{
            if(response.data===true){
              this.$message.success('添加成功')
              this.resetForm();
              bus.$emit('closeAddDialog')
              bus.$emit('flushOrderList');
            }else{
              this.$message.error('添加失败')
            }
          })
        } else {
          this.$message.error('数据格式数据不对,或错误')
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
