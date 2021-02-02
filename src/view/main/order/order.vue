<template>
  <div id="order">
    <el-row>
      <el-col :span="1.5">
        <el-button @click="AddEditDisplayBuff = true">添加订单</el-button>
      </el-col>
      <el-col :span="1.5"><el-button @click="">批量删除</el-button></el-col>
      <el-col :span="1.5">
        <el-input v-model="search" size="max" placeholder="请输入订单地址"/>
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
          width="80"
          sortable><!--排序-->
      </el-table-column>
      <el-table-column
          prop="customerId"
          label="客户ID"
          width="80">
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
          width="400">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="showPhoto(scope.row.id)">管理图片
          </el-button>
          <el-button
              size="mini"
              @click="qrCode(scope.row.id)">扫码查看
          </el-button>
          <el-button
              size="mini"
              @click="jumpPhotos(scope.row.id)">查看图片
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

    <!--//添加编辑-->
    <el-dialog :visible.sync="AddEditDisplayBuff" :before-close="handleClose" width="25%">
      <div slot="footer" class="dialog-footer">
        <AddEdit v-bind:userData="userData"></AddEdit>
        <el-button @click="clearAddEdit">清 空</el-button>
        <el-button type="primary" @click="BusAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!--//上传图片窗口-->
    <el-dialog :visible.sync="UpDisplayBuff" width="25%">
      <div slot="footer" class="dialog-footer">
        <updatePhoto v-bind:userData="userData"></updatePhoto>
      </div>
    </el-dialog>

    <!--//显示图片窗口-->
    <el-dialog :visible.sync="ShowDisplayBuff" width="500px" height="600px">
        <!--<img src="static/image/fushuai.jpg" alt="...">-->
        <el-carousel trigger="click" indicator-position="outside">
          <!--:key根据什么id循环 contain包含-->
          <el-carousel-item v-for="photo in photoList" :key="photo.id">
            <!--<span class="demonstration">{{ photo.id }}</span>-->
              <el-button class="el-icon-delete" @click="delPhoto(photo.id,photo.url)"></el-button>
              <el-image :src="staPath+photo.name" fit="scale-down"/>
          </el-carousel-item>
        </el-carousel>
    </el-dialog>

    <!--二维码页面-->
    <el-dialog title="扫码查看图片" :visible.sync="CodeDisplayBuff" width="15%">
      <div id="qrcode"></div>
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";
import bus from "../../Bus";
import updatePhoto from "./uploadPhoto";
import AddEdit from "./orderAddEdit"
import QRCode from 'qrcodejs2'

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
      ShowDisplayBuff: false,//管理图片弹出框状态值
      AddEditDisplayBuff:false,//添加弹出框
      CodeDisplayBuff: false,
      staPath:'static/image/',
      codeText:'',
      //staPath:'D:\\workspace\\FuShuai_Vue\\static\\image',
    }
  },
  props:['userData'],
  components: {
    updatePhoto:updatePhoto,
    AddEdit:AddEdit,
  },
  mounted: function () {
    this.flushList();
    bus.$on('flushList',this.flushList)
    bus.$on('closeAddDialog',this.closeAddDialog)
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
        //console.log(this.photoList)
      })
    },
    delPhoto(photoId,photoUrl){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(this.httpUrl.url+'/photo/del',{p_photo_id:photoId,p_photo_url:photoUrl})
        .then(response=>{
          if (response.data===true){
            this.$message.success('删除成功')
          }else {
            this.$message.warning('，图片已删除或删除失败')
          }
        })
        this.ShowDisplayBuff=false;

      }).catch(() => {
        this.$message.info('已取消删除')
      });
    },
    //用于刷新list页面
    flushList(){
      //console.log(this.httpUrl.url+'/customer/list')
      axios.get(this.httpUrl.url+'/order/list').then(response=>{
        this.orderList=response.data;
        //console.log(response.data);
      })
    },
    BusAdd(){
      this.AddEditDisplayBuff=true;
      bus.$emit('BusAddOrder',this.userData)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    clearAddEdit(){
      bus.$emit('clearOrderForm')
    },
    closeAddDialog(){
      this.AddEditDisplayBuff=false;
    },
    jumpPhotos(orderId){
      this.$router.push({path:'/showImages',query:{orderId:orderId}})
    },
    qrCode(orderId) {
      this.CodeDisplayBuff = true;
      this.$nextTick(function () {
        document.getElementById("qrcode").innerHTML = "";
        let qrcode = new QRCode("qrcode", {
          width: 150,
          height: 150,
          text: this.httpUrl.vueUrl+'/#/showImages?orderId='+orderId,
          colorDark: "#feffff",
          colorLight: "#000000"
        });
        console.log(qrcode)
      });
    }
  }
};
</script>

<style scoped>
</style>
