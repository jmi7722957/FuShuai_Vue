//.是代表文件所在层，@在/build/webpack.base.conf.js中配置的
import indexMain from '../view/main/indexMain'
import order from '../view/main/order/order'
import list from '../view/main/customer/list'
import login from '../view/user/login'
import cusAddEdit from '../view/main/customer/cusAddEdit'
import showImages from '../view/main/order/showImages'
import qrcode from '../view/main/qrcode'


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
    {
      path: '/showImages',
      name: 'showImages',
      component: showImages,
      meta: {title: '客户样板图片',keepalive: false}
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: qrcode,
      meta: {title: '二维码测试',keepalive: false}
    }
  ]
})
