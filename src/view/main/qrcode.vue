<template>
  <div>
    <el-button type="primary" @click="qrCode()" style="margin-left: 20px">生成二维码</el-button>
    <el-dialog title="扫码查看图片" :visible.sync="CodeDisplayBuff1" width="15%">
      <div id="qrcode"></div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  name: "qrcode",
  data(){
    return {
      CodeDisplayBuff1: false,
      codeText1:'你系郑郑..蓥吗？',
    }
  },
  methods: {
    qrCode() {
      this.dialogVisible = true;
      this.$nextTick(function () {
        document.getElementById("qrcode").innerHTML = "";
        let qrcode = new QRCode("qrcode", {
          width: 150,
          height: 150,
          text: this.codeText1,
          colorDark: "#feffff",
          colorLight: "#000000"
        });
      });
    }
  },
}
</script>

<style scoped>

</style>
