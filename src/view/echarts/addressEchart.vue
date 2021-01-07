<template>
    <div>
      <h2>
        {{ charts.address }}
        {{ charts.numbers }}
      </h2>
        <div id="address" style="width: 600px;height:400px;"></div>
    </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'

export default {
  name: 'addressEchart',
  mounted () {
    this.initialize();
  },
  data () {
    return {
      charts:{
        title: '客户地址统计',
        address:[],
        numbers:[]
      }
    }
  },
  methods:{
    initialize(){
      var addressList=[];
      var numbersList=[];
      axios.get('http://localhost:8081/customer/addressEcharts').then(response=>{
        //console.log(response)
        var list=response.data;
        list.forEach(function (element){
          addressList.push(element.address);
          numbersList.push(element.number);
        });
        this.$data.name='jason';
        this.$data.charts.address=addressList;
        this.$data.charts.numbers=numbersList;

        //因为加载顺序的问题，建议在里面运行此方法，出去了就会优先加载静态data里面的
        this.greateChart();
      });

    },
    greateChart(){
      var myChart = echarts.init(document.getElementById('address'));
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: this.charts.title
        },
        tooltip: {},
        legend: {
          data:['数量']
        },
        xAxis: {
          data: this.charts.address
        },
        yAxis: {},
        series: [{
          name: '数量',
          type: 'bar',
          data: this.charts.numbers
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  },

}
</script>

<style scoped>

</style>
