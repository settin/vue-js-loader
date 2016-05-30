/**
 * Created by setin on 2016/5/7.
 */
window.router = Router({
    '/test':function(){
        module.renderPage('test.vue');
    },
    '/test1':function(){
        module.renderPage('test1.vue');
    }
}).configure({recurse:'forward'});
/*加载全局组件*/
module.require(['component/my-header.vue'],function(){
    /*全局组件注册*/
    Vue.component('my-header',module.vueJSON['component/my-header.vue']);
    /*加载全局组件样式*/
    module.appendCss(['component/my-header.vue'],true);
    /*初始化hash路由*/
    router.init();
    location.hash.length > 0 || (location.hash = '/test');
})