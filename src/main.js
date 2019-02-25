import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VCharts from 'v-charts'
import 'element-ui/lib/theme-chalk/index.css'
import '../static/css/icon.css';
import "babel-polyfill";import moment from 'moment/moment'
Vue.filter('moment', function (value, formatString) {
    formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
return moment(value).format(formatString);

});
Vue.filter('moment1', function (value, formatString) {
    formatString = formatString || 'YYYY-MM-DD ';
return moment(value).format(formatString);

});
// 引用axios，并设置基础URL为后端服务api地址
var axios = require('axios')
axios.defaults.baseURL = 'http://localhost:8443/api'
// 将API方法绑定到全局
Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VCharts);
//Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    if(!role && to.path !== '/login'){
        next('/login');
    }else if(to.meta.permission){
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
})
router. push('components' )
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');