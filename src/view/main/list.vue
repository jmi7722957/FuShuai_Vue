<template>
  <div>

    <el-row>
      <el-col :span="1.5">
        <el-button @click="addCus()">添加客户</el-button>
      </el-col>
      <el-col :span="1.5"><el-button @click="delCus($data.p_idList)">删除</el-button></el-col>
      <el-col :span="1.5">
        <el-input v-model="search" size="max" placeholder="请输入名字"/>
      </el-col>
      <el-col :span="1.5">
        <el-button @click="clearFilter">清除所有过滤器</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button @click="">调查</el-button>
      </el-col>
    </el-row>

    <!--ref：引用编号,toLowerCase()将字符串转换为小写-->
    <el-table
      ref="filterTable"
      :data="customerList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      stripe
      border
      @selection-change="getDelId"
    ><!--stripe斑马线-->
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="id"
        label="id"
        width="180"
        sortable><!--排序-->
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop=sex
        label="性别"
        width="180"
        :formatter="sexChange"
        :filters="[{text:'男',value:'M'},{text:'女',value:'W'}]"
        :filter-method="filterHandler">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        width="180">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        prop="introducer"
        label="介绍人"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="orderCus(scope.row.id)">查看订单
          </el-button>

          <el-button
            size="mini"
            @click="editCus(scope.row)">Edit
          </el-button>

          <!--页面序列0开始：scope.$index, 当前行数据：scope.row-->
          <el-button
            size="mini"
            type="danger"
            @click="delCus(scope.row.id)">Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :visible.sync="DisplayBuff" :before-close="closeReg">
      <div slot="footer" class="dialog-footer">
        <register v-bind:userData="userData"></register>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
import register from './register'
import bus from '../Bus'

export default {
  name: 'list',
  data(){
    return{
      customerList:[{
        id:'',
        name:'',
        sex:'',
        address:'',
        phone:'',
        introducer:'',
        orderListId:''
      }],//用于添加编辑
      query:{
        name:'城主',
        sex:'M'
      },
      delIdList:'',//用于批量删除
      search: '',//搜索框里面的值
      DisplayBuff: false,
    }
  },/*装载完后执行*/
  components:{
    register:register,
  },
  props:['userData'],
  mounted() {
    //console.log(this.userData)
    axios.get('http://localhost:8081/customer/list').then(response=>(this.customerList=response.data))
    //xios.get('http://localhost:8081/customer/list').then(response=>(console.log(response.data)))
  },
  methods: {
    sexChange:function (row, column)
    {//获取用户的选中，在form里面监视select的值
      var date = row[column.property];
      if (date==='M'){
        return '男'
      }
      else if(date==='W'){
        return '女'
      }else{
        return ''
      }
    },
    /*清理筛选*/
    clearFilter() {
      /*$refs获取所有标注了ref的属性*/
      this.$refs.filterTable.clearFilter();
    },
    getDelId(val) {
      //console.log(val);
      var idList = '';
      val.forEach(function(entity){
        if (idList == null || idList === "")
        {
          idList = entity.id;
        }
        else {
          idList = idList + "," + entity.id;
        }
      });
      this.delIdList=idList;
      //alert(this.p_idList);
    },
    orderCus(){
    },
    addCus(){
      this.DisplayBuff = true;
      //query传参要用path来引入，params传参要用name来引入
      /*添加完刷新数据*/
      axios.get('http://localhost:8081/customer/list').then(response=>(this.customerList=response.data))
    },
    editCus(row){
      this.DisplayBuff = true;
      //console.log(row)
      bus.$emit('giveRow',row)
      //query传参要用path来引入，params传参要用name来引入
      //this.$router.push({name:"register",params:{seleType:"edit",student:row}});
      axios.get('http://localhost:8081/customer/list').then(response=>(this.customerList=response.data))
    },
    delCus(delNum){
      axios.post('/vinda_demo_wx/stu/del',{
        p_del_list:delNum
      }).then(response =>{
        console.log(response.data)
        axios.get('http://localhost:8081/customer/list').then(response=>(this.customerList=response.data))
      })
    },
    /*用于列里面的筛选*/
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    closeReg(){
      this.$data.DisplayBuff=false;
      bus.$emit('closeReg');
      axios.get('http://localhost:8081/customer/list').then(response=>(this.customerList=response.data))
    }
  }
}
</script>

<style scoped>

</style>
