<template>
  <div id="order">
    <el-row>
      <el-col :span="1.5">
        <el-button @click="addCus()">添加客户</el-button>
      </el-col>
      <el-col :span="1.5"><el-button @click="delCus()">批量删除</el-button></el-col>
      <el-col :span="1.5">
        <el-input v-model="search" size="max" placeholder="请输入名字"/>
      </el-col>
    </el-row>

    <!--ref：引用编号,toLowerCase()将字符串转换为小写-->
    <el-table
        ref="filterTable"
        :data="orderList
      .filter(data => !search || data.order_address.toLowerCase().includes(search.toLowerCase()))
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
          width="50"
          sortable><!--排序-->
      </el-table-column>
      <el-table-column
          prop="customer_id"
          label="客户ID"
          width="100">
      </el-table-column>
      <el-table-column
          prop=order_address
          label="订单地址"
          width="50">
      </el-table-column>
      <el-table-column
          prop="deposit"
          label="定金"
          width="180">
      </el-table-column>
      <el-table-column
          prop="total_money"
          label="合计金额"
          width="180">
      </el-table-column>
      <el-table-column
          prop="return_money"
          label="退回金额"
          width="100">
      </el-table-column>
      <el-table-column
          prop="end_money"
          label="最后金额"
          width="100">
      </el-table-column>
      <el-table-column
          prop="remarks"
          label="备注"
          width="100">
      </el-table-column>
      <el-table-column
          prop="create_time"
          label="create_time"
          width="100">
      </el-table-column>
      <el-table-column
          prop="update_time"
          label="update_time"
          width="100">
      </el-table-column>
      <el-table-column
          prop="create_person"
          label="create_person"
          width="100">
      </el-table-column>
      <el-table-column
          prop="update_person"
          label="update_person"
          width="100">
      </el-table-column>
      <el-table-column
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="editCus(scope.row)">Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes=pageNumberList
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="orderList.length">
    </el-pagination>
  </div>
</template>

<script>
import axios from "axios";
import bus from "../Bus";

export default {
  name: 'order',
  data() {
    return {
      orderList:[{
        id:'',
        customer_id:'',
        order_address:'',
        deposit:'',
        total_money:'',
        return_money:'',
        remarks:'',
        create_time:'',
        update_time:'',
        create_person:'',
        update_person:''
      }],

      pageNumberList:[5,10,15,20],//选择几条一页下拉
      currentPage:1, //初始页
      pageSize:5,    //每页几条数据

      delIdList:[],//用于批量删除
      search: '',//搜索框里面的值
      DisplayBuff: false,
    }
  },
  mounted: function () {
    bus.$on('flushList',this.flushList)
    this.flushList();
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

    getSelectId(val){
      var li = [];
      val.forEach(function(element){
        var id=element.id;
        li.push(id)
      });
      this.$data.delIdList=li;
      //console.log(this.$data.delIdList)
    },

    /*清理筛选*/
    clearFilter() {
      /*$refs获取所有标注了ref的属性*/
      this.$refs.filterTable.clearFilter();
      this.search='';
    },

    //用于刷新list页面
    flushList(){
      //console.log(this.httpUrl.url+'/customer/list')
      axios.get(this.httpUrl.url+'/order/list').then(response=>(this.orderList=response.data))
      bus.$emit('flushEcharts')
    }
  }
};
</script>

<style scoped>
</style>
