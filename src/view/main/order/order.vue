<template>
  <div id="order">
    <el-row>
      <el-col :span="1.5">
        <el-button @click="">添加客户</el-button>
      </el-col>
      <el-col :span="1.5"><el-button @click="">批量删除</el-button></el-col>
      <el-col :span="1.5">
        <el-input v-model="search" size="max" placeholder="请输入名字"/>
      </el-col>
    </el-row>

    <!--ref：引用编号,toLowerCase()将字符串转换为小写-->
    <el-table
        ref="filterTable"
        :data="orderList
      .filter(data => !search || data.orderAddress.toLowerCase().includes(search.toLowerCase()))
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
          prop="customerId"
          label="客户ID"
          width="50">
      </el-table-column>
      <el-table-column
          prop=orderAddress
          label="订单地址"
          width="300">
      </el-table-column>
      <el-table-column
          prop="deposit"
          label="定金"
          width="80">
      </el-table-column>
<!--      <el-table-column
          prop="totalMoney"
          label="合计金额"
          width="80">
      </el-table-column>
      <el-table-column
          prop="returnMoney"
          label="退回金额"
          width="80">
      </el-table-column>
      <el-table-column
          prop="endMoney"
          label="最后金额"
          width="80">
      </el-table-column>-->
      <el-table-column
          prop="remarks"
          label="备注"
          width="250">
      </el-table-column>
<!--      <el-table-column
          prop="createTime"
          label="createTime"
          width="100">
      </el-table-column>
      <el-table-column
          prop="updateTime"
          label="updateTime"
          width="100">
      </el-table-column>
      <el-table-column
          prop="createPerson"
          label="createPerson"
          width="100">
      </el-table-column>
      <el-table-column
          prop="updatePerson"
          label="updatePerson"
          width="100">
      </el-table-column>-->
      <el-table-column
          label="操作"
          width="300">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="showPhoto(scope.row.id)">查看图片
          </el-button>
          <el-button
              size="mini"
              @click="onUpPhoto(scope.row.id)">上传图片
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页控制-->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes=pageNumberList
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="orderList.length">
    </el-pagination>

    <!--//上传图片窗口-->
    <el-dialog :visible.sync="UpDisplayBuff">
      <div slot="footer" class="dialog-footer">
        <updatePhoto v-bind:userData="userData"></updatePhoto>
      </div>
    </el-dialog>

    <!--//显示图片窗口-->
    <el-dialog :visible.sync="ShowDisplayBuff">
      <div slot="footer" class="dialog-footer">
        <!--<img src="static/image/fushuai.jpg" alt="...">-->
        <el-carousel trigger="click" height="500px">
          <!--:key根据什么id循环 contain包含-->
          <el-carousel-item v-for="photo in photoList" :key="photo.id">
            <el-image :src="staPath+photo.name" fit="contain"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";
import bus from "../../Bus";
import updatePhoto from "./uploadPhoto";

export default {
  name: 'order',
  data() {
    return {
      orderList:[{
        id:'',
        customerId:'',
        orderAddress:'',
        deposit:'',
        totalMoney:'',
        returnMoney:'',
        remarks:'',
        createTime:'',
        updateTime:'',
        createPerson:'',
        updatePerson:''
      }],
      photoList:[{
        id:'',
        name:'',
        orderId:'',
        url:''
      }],
      pageNumberList:[5,10,15,20],//选择几条一页下拉
      currentPage:1, //初始页
      pageSize:5,    //每页几条数据
      delIdList:[],//用于批量删除
      search: '',//搜索框里面的值
      UpDisplayBuff: false,//上传弹出框状态值
      ShowDisplayBuff: false,//显示弹出框状态值
      te:'localhost:8080/D://test//20190315165001_5y2.jpg',
      staPath:'static/image/'
    }
  },
  props:['userData'],
  components: {
    updatePhoto:updatePhoto,
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
    onUpPhoto(orderId){
      this.UpDisplayBuff=true;
      /*console.log('进入组件前')
      console.log(row)*/
      bus.$emit('getOrderId',orderId)
    },
    showPhoto(orderId){
      this.ShowDisplayBuff=true;
      this.axios.post(this.httpUrl.url+'/photo/showPhoto', {p_orderId: orderId})
      .then(response=>{
        //console.log(response.data)
        this.photoList=response.data
        console.log(this.photoList)
      })
    },
    //用于刷新list页面
    flushList(){
      //console.log(this.httpUrl.url+'/customer/list')
      axios.get(this.httpUrl.url+'/order/list').then(response=>{
        this.orderList=response.data;
        //console.log(response.data);
      })
    }
  }
};
</script>

<style scoped>
</style>
