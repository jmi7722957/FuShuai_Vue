<template>
  <div class="demo-image__lazy">
    <el-image v-for="url in urls" :key="url" :src="url"></el-image>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "showImages",
  mounted() {
    this.getPhotos();
  },
  data(){
    return{
      urls:[],
      staPath:'static/image/',
      orderId:'',
      photoList:[{
        id:'',
        name:'',
        orderId:'',
        url:''
      }],
    }
  },
  props:[],
  methods:{
    //!!!!!请注意Vue是mountde（）之后一次性生成的，所以在mountde里面赋值给data后，不能再调用，里面是空的，还没生成
    getPhotos(){
      if (this.$route.query.orderId!==undefined){
        this.axios.post(this.httpUrl.url+'/photo/showPhoto', {p_orderId: this.$route.query.orderId})
            .then(response=>{
              let list=response.data
              let urlsList=[];
              //循环遍历转换成想要的图片地址数组
              list.forEach(function(element){
                let name=element.name;
                urlsList.push('static/image/'+name);
              });
              this.urls=urlsList;
            });
      }else{
        this.$message.info('不存在OrderID')
        return;
      }
    }
  }
}
</script>

<style scoped>

</style>
