<template>
  <div id="test">
    <el-input type="file" @click="importf(this)" />
    <div id="demo"></div>
  </div>
</template>

<script>
import XLSX from 'xlsx'

var wb;//读取完成的数据
var rABS = false; //是否将文件读取为二进制字符串
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
    importf:function (obj){
      if(!obj.files) {
        return;
      }
      var f = obj.files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        if(rABS) {
          wb = XLSX.read(btoa(this.fixdata(data)), {//手动转化
            type: 'base64'
          });
        } else {
          wb = XLSX.read(data, {
            type: 'binary'
          });
        }
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        document.getElementById("demo").innerHTML= JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) );
      };
      if(rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    fixdata:function (data) {
      var o = "",
          l = 0,
          w = 10240;
      for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
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
