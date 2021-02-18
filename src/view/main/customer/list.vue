<template>
  <div id="list">

    <!--//表格控制-->
    <el-row>
      <el-col :span="1.5">
        <el-button @click="addCus()">添加客户</el-button>
      </el-col>
      <el-col :span="1.5"><el-button @click="delCus()">批量删除</el-button></el-col>
      <el-col :span="1.5">
        <el-input v-model="search" size="max" placeholder="名字/地址"/>
      </el-col>
      <el-col :span="1.5">
        <el-button @click="clearFilter">清除所有过滤器</el-button>
      </el-col>

      <!--导入excel数据-->
      <el-col :span="1.5">
        <el-button><upload/></el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button @click="exportTemplate">下载模板</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button @click="exportExcel">导出excel</el-button>
      </el-col>
    </el-row>

    <!--//表格显示-->
    <!--ref：引用编号,toLowerCase()将字符串转换为小写-->
    <el-table
      ref="filterTable"
      :data="customerList
      .filter(data => !search
      || data.name.toLowerCase().includes(search.toLowerCase())
      || data.address.toLowerCase().includes(search.toLowerCase()))
      .slice((currentPage-1)*pageSize,currentPage*pageSize)"
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
        width="80"
        sortable><!--排序-->
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop=sex
        label="性别"
        width="80"
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
        width="100">
      </el-table-column>
      <el-table-column
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="orderCus(scope.row.id)">查看订单
          </el-button>

          <el-button
            size="mini"
            @click="editCus(scope.row)">Edit
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!--//分页控制-->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes=pageNumberList
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="customerList.length">
    </el-pagination>

    <!--//Echarts图表-->
    <chart></chart>

    <!--//添加编辑-->
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
import addressEchart from '../../echarts/addressEchart'
import uploadExcel from './uploadExcel'
import bus from '../../Bus'
import {export_json_to_excel} from '../../../vendor/Export2Excel'

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
      }],

      pageNumberList:[5,10,15,20],//选择几条一页下拉
      currentPage:1, //初始页
      pageSize:5,    //每页几条数据

      query:{//用于添加编辑
        name:'城主',
        sex:'M'
      },
      delIdList:[],//用于批量删除
      search: '',//搜索框里面的值
      DisplayBuff: false,//弹出框
    }
  },/*装载完后执行*/
  components:{
    register:register,
    chart:addressEchart,
    upload:uploadExcel,
  },
  props:['userData'],
  mounted() {
    //console.log(this.userData)
    bus.$on('flushList',this.flushList)
    bus.$on('closeAddDia',this.closeAddDia)
    this.flushList();
    //xios.get('http://localhost:8081/customer/list').then(response=>(console.log(response.data)))
  },
  methods: {
    //更改每页多少条触发
    handleSizeChange: function (size) {
      this.pageSize = size;
    },
    //更改当前页触发
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage;
    },
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
      this.search='';
    },
    orderCus(){
    },
    addCus(){
      this.DisplayBuff = true;
      //query传参要用path来引入，params传参要用name来引入
      /*添加完刷新数据*/
      this.flushList();
    },
    editCus(row){
      this.DisplayBuff = true;
      //console.log(row)
      bus.$emit('giveRow',row)
      //query传参要用path来引入，params传参要用name来引入
      this.flushList();
    },
    getSelectId(val){
      var li = [];
      val.forEach(function(element){
        var id=element.id;
        li.push(id)
      });
      this.$data.delIdList=li;
      //console.log(this.$data.delIdList)
    },
    delCus(){
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          //console.log(this.delIdList);
          this.axios({
            method:'post',
            url:this.httpUrl.url+'/customer/delete',
            data:{
              p_del_list:this.delIdList
            }
          }).then(response =>{
            //console.log(response.data)
            if (response.data===true)
            {
              this.$message.success('删除成功！');
              this.flushList();
            }else{
              this.$message.warning('删除失败！');
              this.flushList();
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /*用于列里面的筛选*/
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    closeReg(){
      this.$data.DisplayBuff=false;
      bus.$emit('closeReg');
      this.flushList();
    },

    //导出模板
    exportTemplate: function() {
      require.ensure([], () => {
        //const {export_json_to_excel} = require('../../vendor/Export2Excel'); //引入文件　　　　　　
        const tHeader = ['姓名', '性别', '地址', '电话','介绍人']; //将对应的属性名转换成中文
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
    //导出数据为json格式再写到excel
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    //用于刷新list页面
    flushList(){
      //console.log(this.httpUrl.url+'/customer/list')
      axios.get(this.httpUrl.url+'/customer/list').then(response=>(this.customerList=response.data))
      bus.$emit('flushEcharts')
    },
    closeAddDia(){
      this.DisplayBuff=false;
    }
  },
}
</script>

<style scoped>

</style>
