<template>
  <div id="from">

    <el-row>
      <el-col :span="2">
        <el-button><router-link :to="'/reg'"  >无参添加</router-link></el-button>
      </el-col>
      <el-col :span="2">
        <el-button @click="addStu()">有参添加2</el-button>
      </el-col>
      <el-col :span="1.5"><el-button @click="delStu($data.p_idList)">删除</el-button></el-col>
    </el-row>
    <el-row>
      <el-col :span="1.5">
        <el-input v-model="search" size="max" placeholder="输入关键字搜索"/>
      </el-col>
      <el-col :span="1.5">
        <el-button @click="clearFilter">清除所有过滤器</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-date-picker
            v-model="time"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00', '08:00:00']">
          <!--设置起始值与结束值-->
        </el-date-picker>
      </el-col>
      <el-col :span="1.5">
        <el-button @click="findByCond">调查</el-button>
      </el-col>
    </el-row>

    <!--ref：引用编号-->
    <el-table
        ref="filterTable"
        :data="stulist.filter(data => !search || data.STU_NAME.toLowerCase().includes(search.toLowerCase()))"
        stripe
        border
        @selection-change="getDelId"
    ><!--斑马线-->
      <el-table-column
          type="selection">
      </el-table-column>
      <el-table-column
          prop="STU_ID"
          label="ID"
          width="180"
          sortable><!--排序-->
      </el-table-column>
      <el-table-column
          prop="STU_NAME"
          label="姓名"
          width="180">
      </el-table-column>
      <el-table-column
          prop=STU_SEX
          label="性别"
          width="180"
          :formatter="sexChange"
          :filters="[{text:'男',value:'M'},{text:'女',value:'W'}]"
          :filter-method="filterHandler">
      </el-table-column>
      <el-table-column
          prop="STU_STATUS"
          label="状态"
          width="180"
          :formatter="statusChange"
          :filters="[{text:'在校',value:'S'},{text:'毕业',value:'G'},{text:'休学',value:'D'}]"
          :filter-method="filterHandler">
      </el-table-column>
      <el-table-column
          prop="CREATION_DATE":formatter="dateFormat"
          label="创建时间"
          width="180"
          sortable>
      </el-table-column>
      <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="editStu(scope.row)">Edit
            </el-button>

            <!--页面序列0开始：scope.$index, 当前行数据：scope.row-->
            <el-button
                size="mini"
                type="danger"
                @click="delStu(scope.row.STU_ID)">Delete
            </el-button>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/*后端交互*/
import axios from 'axios';
/*转换格式用*/
import moment from 'moment';

  export default {
    data(){
      return{
        stulist:[{
          STU_ID:'',
          STU_NAME:'',
          STU_SEX:'',
          STU_STATUS:'',
          CREATION_DATE:''
        }],
        query:{
          name:'城主',
          sex:'M'
        },
        p_idList:'',
        search: '',
        time: ''
      }
    },/*装载完后执行*/
    mounted() {
      axios.get('/vinda_demo_wx/stu/list').then(response=>(this.stulist=response.data))
      //axios.get('/vinda_demo_wx/stu/list').then(response=>(console.log(this.stulist)))
    },
    components:{

    },
    methods: {
        findByCond:function(){
          var timeList=this.time;
          var p_onTime=timeList[0];
          var p_toTime=timeList[1];
          p_onTime=moment(p_onTime).format("YYYY-MM-DD hh:mm:ss");
          p_toTime=moment(p_toTime).format("YYYY-MM-DD hh:mm:ss");
          console.log(p_onTime);
          console.log(p_toTime);
        },
        /*格式化列的时间*/
        dateFormat: function (row, column) {
          var date = row[column.property];
          if (date == undefined) {
            return ''
          };
          return moment(date).format("YYYY-MM-DD hh:mm:ss")
        },
        sexChange:function (row, column)
        {//获取用户的选中，在form里面监视select的值
          var date = row[column.property];
          if (date=='M'){
            return '男'
          }
          else if(date=='W'){
            return '女'
          }else{
            return ''
          }
        },
        statusChange:function (row, column){
          var date = row[column.property];
          if (date=='S'){
            return '在读';
          }
          else if(date=='G'){
            return '毕业';
          }else if (date=='D'){
            return '休学';
          }else{
            return '';
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
            if (idList == null || idList == "")
            {
              idList = entity.STU_ID;
            }
            else {
              idList = idList + "," + entity.STU_ID;
            }
          });
          //alert(idList);
          this.p_idList=idList;
          //alert(this.p_idList);
        },
        addStu(){
          //query传参要用path来引入，params传参要用name来引入
          this.$router.push({name:"reg",params:{seleType:"add"}});
         /*添加完刷新数据*/
          axios.get('/vinda_demo_wx/stu/list')
              .then(response=>(this.stulist=response.data))
        },
        editStu(row){
          //query传参要用path来引入，params传参要用name来引入
          this.$router.push({name:"reg",params:{seleType:"edit",student:row}});
          axios.get('/vinda_demo_wx/stu/list').then(response=>(this.stulist=response.data))
        },
        delStu(delNum){
          this.$axios.post('/vinda_demo_wx/stu/del',{
            p_del_list:delNum
          }).then(response =>{
            console.log(response.data)
            axios.get('/vinda_demo_wx/stu/list').then(response=>(this.stulist=response.data))
          })
        },
        /*用于列里面的筛选*/
        filterHandler(value, row, column) {
          const property = column['property'];
          return row[property] === value;
        }
    }
  }
</script>

<style scoped>
.el-table{
  border: 4px solid gold;
  width: 1500px;
}
</style>
