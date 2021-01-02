import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUi from 'element-ui'
import ElementCss from 'element-ui/lib/theme-chalk/index.css'

//.是代表文件所在层，@在/build/webpack.base.conf.js中配置的
import main from '../view/main'
import test from '../view/main/test'
import list from '../view/main/list'
import login from '../view/user/login'
import register from '../view/main/register'
import axios from 'axios'
import VueAxios from 'vue-axios'


Vue.use(VueAxios, axios)
Vue.use(VueRouter)
Vue.use(ElementUi)
Vue.use(ElementCss)

export default new VueRouter({
  routes: [
    {
      path: '/main',
      name: 'main',
      component: main,
      children:[{
          path: '/test',
          name: 'test',
          component: test,
        },
        {
          path: '/list',
          name: 'list',
          component: list,
          children:[{
              path: '/register',
              name: 'register',
              component: register
            }]
        }]
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {title: '欢迎登陆',keepalive: false}
    }
  ]
})
