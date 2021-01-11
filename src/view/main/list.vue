<template>
  <div id="list">

    <el-row>
      <el-col :span="1.5">
        <el-button @click="addCus()">添加客户</el-button>
      </el-col>
      <el-col :span="1.5"><el-button @click="delCus()">删除</el-button></el-col>
      <el-col :span="1.5">
        <el-input v-model="search" size="max" placeholder="请输入名字"/>
      </el-col>
      <el-col :span="1.5">
        <el-button @click="clearFilter">清除所有过滤器</el-button>
      </el-col>

      <!--导入excel数据-->
      <el-col :span="1.5">
        <el-input type="file" @change="importExcel(this)" accept=".csv,
         application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
          application/vnd.ms-excel"/>
      </el-col>

      <el-col :span="1.5">
        <el-button @click="exportTemplate">下载模板</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button @click="exportExcel">导出excel</el-button>
      </el-col>
    </el-row>

    <!--ref：引用编号,toLowerCase()将字符串转换为小写-->
    <el-table
      ref="filterTable"
      :data="customerList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      stripe
      border
      @selection-change="getSelectId"
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

    //Echarts图表
    <chart></chart>

    <el-dialog :visible.sync="DisplayBuff" :before-close="closeReg">
      <div slot="footer" class="dialog-footer">
        <register v-bind:userData="userData"></register>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import axios from 'axios'
import register from './cusAddEdit'
import addressEchart from '../echarts/addressEchart'
import bus from '../Bus'
import {export_json_to_excel} from '../../vendor/Export2Excel'

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
        introducer:''
      }],//用于添加编辑
      query:{
        name:'城主',
        sex:'M'
      },
      delIdList:[],//用于批量删除
      search: '',//搜索框里面的值
      DisplayBuff: false,
    }
  },/*装载完后执行*/
  components:{
    register:register,
    chart:addressEchart
  },
  props:['userData'],
  mounted() {
    //console.log(this.userData)
    axios.get('http://localhost:8081/customer/list').then(response=>(this.customerList=response.data))
    //xios.get('http://localhost:8081/customer/list').then(response=>(console.log(response.data)))
  },
  methods: {
    sexChange:function (row, column){
      //获取用户的选中，在form里面监视select的值
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
      axios.get('http://localhost:8081/customer/list').then(response=> {
        this.customerList = response.data;
      });
    },
    getSelectId(val){
      var li = [];
      val.forEach(function(element){
        var id=element.id;
        li.push(id)
      });
      this.$data.delIdList=li;
      console.log(this.$data.delIdList)
    },
    delCus(){
      console.log(this.delIdList);
      this.axios({
        method:'post',
        url:'http://localhost:8081/customer/delete',
        data:{
          p_del_list:this.delIdList
        }
      }).then(response =>{
        //console.log(response.data)
        if (response.data===true)
        {
          alert("删除成功！")
          axios.get('http://localhost:8081/customer/list').then(response=>(this.customerList=response.data))
        }else{
          alert("删除失败！！！")
          axios.get('http://localhost:8081/customer/list').then(response=>(this.customerList=response.data))
        }
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
    },

    //excel导入数据
    importExcel(obj) {
      let _this = this;
      let inputDOM = this.$refs.inputer;   // 通过DOM取文件数据
      this.file = event.currentTarget.files[0];
      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;
      var reader = new FileReader();
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for(var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require('xlsx');
          if(rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
              type: 'base64'
            });
          } else {
            wb = XLSX.read(binary, {
              type: 'binary'
            });
          }
          // outdata就是你想要的东西 excel导入的数据
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          // excel 数据再处理
          let arr = []
          outdata.map(v => {
            //表头数组
            let obj = {}
            obj.id = v.ID
            obj.name = v.姓名
            obj.sex = v.性别
            obj.address = v.地址
            obj.phone = v.电话
            obj.introducer = v.介绍人
            arr.push(obj)
          })
          _this.accountList = [...arr];
          console.log( _this.accountList)
          _this.reload();
        }
        reader.readAsArrayBuffer(f);
      }
      if(rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    //导出模板
    exportTemplate: function() {
      require.ensure([], () => {
        //const {export_json_to_excel} = require('../../vendor/Export2Excel'); //引入文件　　　　　　
        const tHeader = ['ID', '姓名', '性别', '地址', '电话','介绍人']; //将对应的属性名转换成中文
        const data = [];
        export_json_to_excel(tHeader, data, '客户填写模板');
      })
    },
    //导出数据
    exportExcel() {
      require.ensure([], () => {
        //const { export_json_to_excel } = require('../../vendor/Export2Excel');
        const tHeader = ['ID', '姓名', '性别', '地址', '电话','介绍人']; //对应表格输出的title
        const filterVal = ['id', 'name', 'sex', 'address', 'phone','introducer']; // 对应表格输出的数据
        const list = this.customerList;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '客户表excel'); //对应下载文件的名字
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },
/*  watch:{
    DisplayBuff:function(val) {
      this.DisplayBuff = val;
    }
  }*/
}
</script>

<style scoped>

</style>
