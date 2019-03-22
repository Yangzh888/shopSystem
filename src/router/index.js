import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/index',
                    component: resolve => require(['../components/page/index.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/comeAndOut',
                    component: resolve => require(['../components/page/ComeAndOut.vue'], resolve),
                    meta: { title: '收支统计' }
                },
                 {
                    path: '/comeAndOutAnalysis',
                    component: resolve => require(['../components/page/ComeAndOutAnalysis.vue'], resolve),
                    meta: { title: '收支分析' }
                },
                {
                    path: '/goods',
                    component: resolve => require(['../components/page/Goods.vue'], resolve),
                    meta: { title: '商品管理' }
                },
                  {
                    path: '/editGoods',
                    component: resolve => require(['../components/page/editGoods.vue'], resolve),
                    meta: { title: '配置商品信息' }
                },
                {
                    path: '/readyDo',
                    component: resolve => require(['../components/page/ReadyDo.vue'], resolve),
                    meta: { title: '代办信息' }
                },
                {
                    path: '/wholesaler',
                    component: resolve => require(['../components/page/Wholesaler.vue'], resolve),
                    meta: { title: '批发商管理' }
                },
                 {
                    path: '/userInfo',
                    component: resolve => require(['../components/page/UserInfo.vue'], resolve),
                    meta: { title: '个人信息' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }    
                },
                /*{
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }   
                },*/
                  {
                    // 客户管理
                    path: '/customer',
                    component: resolve => require(['../components/page/Customer.vue'], resolve),
                    meta: { title: '客户管理' }   
                },
                {
                    // vue-schart组件
                    path: '/dataAnalysis',
                    component: resolve => require(['../components/page/DataAnalysis.vue'], resolve),
                    meta: { title: '商铺总括分析' }
                },
                 {
                    // vue-schart组件
                    path: '/orderAnalysis',
                    component: resolve => require(['../components/page/OrderAnalysis.vue'], resolve),
                    meta: { title: '订单分析' }
                },
                 {
                    // vue-schart组件
                    path: '/wholesalerAnalysis',
                    component: resolve => require(['../components/page/wholesalerAnalysis.vue'], resolve),
                    meta: { title: '客户分析' }
                },
                {
                    
                    path: '/search',
                    component: resolve => require(['../components/page/Search.vue'], resolve),
                    meta: { title: '查找题目' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限管理', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
        
    ]
})
