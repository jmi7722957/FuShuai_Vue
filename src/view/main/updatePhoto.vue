<template>
  <div id="updatePhoto">
    <!--action上传文件的存放路径-->
    <el-upload
        class="upload-demo"
        :action=this.updateUrl
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
import bus from '../Bus'
export default {
  name: "updatePhoto",
  data() {
    return {
      fileList: [],
      updateUrl:this.httpUrl.url+"/order/updatePhoto"
    };
  },
  mounted() {
    bus.$on('getOrderId',orderId=>{
      //console.log('组件的orderId：')
      console.log(orderId)
    })
  },
  props:['userData'],
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm('确定移除 ${ file.name }?');
    }
  }
}
</script>

<style scoped>

</style>
