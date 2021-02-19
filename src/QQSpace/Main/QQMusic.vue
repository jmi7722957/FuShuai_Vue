<template>
  <div id="QQMusicDiv">
    <el-row>
      <!--播放暂停--><!--音量按钮-->
      <el-col :span="2.5">
          <el-button
              @click="play"
              id="play"
              :icon="music.isPlay?'el-icon-video-pause':'el-icon-caret-right'"
              circle>
          </el-button>
      </el-col>
      <el-col :span="2.5">
          <el-button
              @click="changeVolume(-10)"
              icon="el-icon-minus"
              circle>
          </el-button>
      </el-col>
      <el-col :span="2.5">
          <el-button
              @click="changeVolume(10)"
              icon="el-icon-plus"
              circle>
          </el-button>
      </el-col>
      <el-col :span="2.5">
          <el-button
                @click="next()"
                icon="el-icon-d-arrow-right"
                circle>
          </el-button>
      </el-col>
    </el-row>

    <!--时间显示--><!--音量进度条-->
    <el-row>
      <el-col>
          <span style="float: left">{{formatTime(music.currentTime)}}/{{formatTime(music.maxTime)}}</span>
          <el-progress style="float: left;width: 63%"
                       color="#67C23A"
                       :percentage="music.volume">
          </el-progress>
      </el-col>

    </el-row>

    <!--进度条-->
    <el-row>
      <el-col>
        <el-slider
            @change="changeTime"
            :format-tooltip="formatTime"
            :max="music.maxTime"
            v-model="music.currentTime"
            style="width: 100%;"></el-slider>
      </el-col>
    </el-row>
    <audio id="audio" ref="music" v-bind:src="this.srcList[sele]" autoplay>
    </audio>
  </div>
</template>

<script>
export default {
  name: "QQMusic",
  data(){
    return {
      sele:0,
      srcList:['static/music/心痛2009.mp3','static/music/原谅我一次.mp3','static/music/棉花糖.mp3'],
      music:{
        isPlay:false,
        currentTime:0,
        maxTime:0,
        volume:100
      },
    }
  },
  mounted(){
    /*监听进度条*/
    this.$nextTick(()=>{
      setInterval(this.listenMusic,1000)
    })
  },
  methods:{
    listenMusic(){
      if(!this.$refs.music){
        return
      }
      if(this.$refs.music.readyState){
        this.music.maxTime = this.$refs.music.duration
      }
      this.music.isPlay=!this.$refs.music.paused
      this.music.currentTime = this.$refs.music.currentTime
    },
    play(){
      if(this.$refs.music.paused){
        this.$refs.music.play()
      }else{
        this.$refs.music.pause()
      }
      this.music.isPlay=!this.$refs.music.paused
      this.$nextTick(()=>{
        document.getElementById('play').blur()
      })
    },
    changeTime(time){
      this.$refs.music.currentTime = time
    },
    changeVolume(v){
      this.music.volume += v
      if(this.music.volume>100){
        this.music.volume = 100
      }
      if(this.music.volume<0){
        this.music.volume = 0
      }
      this.$refs.music.volume = this.music.volume/100
    },
    formatTime(time){
      let it = parseInt(time)
      let m = parseInt(it/60)
      let s = parseInt(it%60)
      return (m<10?"0":"")+parseInt(it/60)+":"+(s<10?"0":"")+parseInt(it%60)
    },
    next(){
      if(this.sele<this.srcList.length-1){
        this.sele++;
      }else {
        this.sele=0;
      }

    },
  },
  /*监听是否结束,自动播放下一首*/
  watch:{
    'music.currentTime': {
      handler: function (val, oldVal) {
        if (val===this.music.maxTime){
          if(this.sele<this.srcList.length-1){
            this.sele++;
          }else {
            this.sele=0;
          }
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
