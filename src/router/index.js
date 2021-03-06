//.是代表文件所在层，@在/build/webpack.base.conf.js中配置的
import indexMain from '../view/main/indexMain';
import order from '../view/main/order/order';
import list from '../view/main/customer/list';
import login from '../view/user/login';
import cusAddEdit from '../view/main/customer/cusAddEdit';
import showImages from '../view/main/order/showImages';
import QQMusic from "../QQSpace/Main/QQMusic";

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
    },
      //向客户显示图片
    {
      path: '/showImages',
      name: 'showImages',
      component: showImages,
      meta: {title: '客户样板图片',keepalive: false}
    },

    //QQ空间模块
    {
      path: '/QQMusic',
      name: 'QQMusic',
      component: QQMusic,
      meta: {title: 'QQ空间音乐',keepalive: false}
    }
  ]
})
