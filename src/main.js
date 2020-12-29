// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'//自动会扫描包下全部
//开发提醒功能
Vue.config.productionTip = false
new Vue({
  el: '#FsIndex',
  router,
  components: { App },
  template: '<App/>'
})
