// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ElementUi from 'element-ui'
import ElementCss from 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './App'
import router from './router'//自动会扫描包下全部
import VueAxios from "vue-axios";
import axios from "axios";
import Echarts from 'echarts'
import VueRouter from "vue-router";
import XLSX from 'xlsx'

Vue.use(VueAxios, axios)
Vue.use(Echarts)
Vue.use(ElementUi)
Vue.use(ElementCss)
Vue.use(VueRouter)
Vue.use(XLSX)

Vue.prototype.$echarts = Echarts
//开发提醒功能
Vue.config.productionTip = false
new Vue({
  el: '#FsIndex',
  router,
  components: { App },
  template: '<App/>'
})
