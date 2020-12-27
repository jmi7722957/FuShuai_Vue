import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUi from 'element-ui'

//.是代表文件所在层，@在/build/webpack.base.conf.js中配置的
import main from '../view/main'
import test from '../view/test'

Vue.use(VueRouter)
Vue.use(ElementUi)

export default new VueRouter({
  routes: [
    {
      path: '/test',
      name: 'test',
      component: test,
      meta: {title: '灰色的轨迹',keepalive: false}
    },
    {
      path: '/main',
      name: 'main',
      component: main,
      meta: {title: '城主无敌',keepalive: false}
    }
  ]
})
