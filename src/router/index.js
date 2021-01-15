//.是代表文件所在层，@在/build/webpack.base.conf.js中配置的
import indexMain from '../view/indexMain'
import order from '../view/main/order'
import list from '../view/main/list'
import login from '../view/user/login'
import cusAddEdit from '../view/main/cusAddEdit'

import VueRouter from "vue-router";

export default new VueRouter({
  routes: [
    {
      path: '/main',
      name: 'main',
      component: indexMain,
      children:[{
          path: '/order',
          name: 'order',
          component: order,
        },
        {
          path: '/list',
          name: 'list',
          component: list,
          children:[
            {
              path: '/cusAddEdit',
              name: 'cusAddEdit',
              component: cusAddEdit
            }]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {title: '欢迎登陆',keepalive: false}
    }
  ]
})
