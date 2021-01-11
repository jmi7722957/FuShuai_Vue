<template>
  <div class="insuranceDataImport">
    <el-upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :on-error="handleError"
        :format ="['xlsx','xls']"
        :max-size="fileSize"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        action="//jsonplaceholder.typicode.com/posts/"
        style="display: inline-block;width:70px;">
      <div>导入数据</div>
    </el-upload>

  </div>
</template>

<script>
export default {
  name: 'test',
  data() {
    return {
      fileName: '客户填写模板',
      fileTemArr: ['客户填写???111'],
      fileSize: 10,
      defaultList: [],
    };
  },
  mounted: function () {

  },
  methods: {
    handleSuccess(res,file){
      if(res.errcode === 0){
        this.$message.success("数据导入成功！")
        this.$refs.upload.clearFiles()
      }
    },
    handleError(error,file){
      this.$message.error("数据导入失败！")
    },

    //错误执行
    handleFormatError (file) {
      this.$notify.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传.xls,.xlsx文件。'
      });
    },
    handleMaxSize (file) {
      this.$notify.warning({
        title: '文件大小错误',
        desc: 'File  ' + file.name + ' 文件大小不得超过'+this.fileSize+'M'
      });
    },
    pro (file) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.$notify.warning({
            title: '文件名称错误',
            desc: 'File  ' + file.name
          });
          reject(new Error('err'))
        }, 100)
      })
    },
    //阻止上传//上传前判断用户选择的模板与实际上传的模板是否相同（文件名判断）
    handleBeforeUpload (file) {
      let name = '';
      if(file.name){
        // name = file.name.replace(/\s/g,"").split('.')[0]
        name = file.name.split('.')[0]
        //alert(name)
        if(name !== this.fileName){
          return this.pro(file)
        }
      }
    }
  }
};
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
