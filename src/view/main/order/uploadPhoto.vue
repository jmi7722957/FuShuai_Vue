<template>
  <div id="uploadPhoto">
    <!--action上传文件的存放路径-->
    <el-upload
        class="upload-demo"
        :action=this.uploadUrl+this.orderId
        :on-success="successMsg"
        :on-error="errorMsg"
        :before-upload="beforeAvatarUpload"
        multiple
        :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import bus from '../../Bus'

export default {
  name: "uploadPhoto",
  data() {
    return {
      fileList: [],
      uploadUrl:this.httpUrl.url+"/photo/uploadPhoto/",
      orderId:''
    };
  },
  mounted() {
    bus.$on('getOrderId',orderId=>{
      //console.log('组件的orderId：')
      //console.log(orderId)
      this.orderId=orderId;
    })
  },
  props:['userData'],
  methods: {
    successMsg(response){
      if(response){
        this.$message.success('上传成功！')
      }else {
        this.$message.warning('上传失败！或图片已存在')
      }

    },
    errorMsg(){
      this.$message.error('上传出错，文件后缀不正确，或文件超过2m，或文件已存在')
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style scoped>

</style>
