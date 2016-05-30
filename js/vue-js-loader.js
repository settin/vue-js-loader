/**
 * Created by setin on 2016/5/6.
 * @name vue-js-loader
 * @version 1.0.4
 * @title vue文件JS加载器
 * 前置条件：
 *  1.依赖vuejs,jquery 1.7.2 +
 *  2.body内需要建立容器元素<router-view></router-view>
 *  3.推荐director路由
 * 使用样例：
 *  module.renderPage('test.vue');
 * 注意事项：
 *  1.hash路由传参：推荐使用缓存对象值传参，即预先建立一个json对象，该对象内放置一个hash传参专用字段
 *  2.组件嵌套层数尽量减少：由于嵌套组件是阻塞式加载，因此嵌套的层数过多会造成页面加载总时间过长
 *  3.一个.vue文件一个组件：目前的加载逻辑无法处理单个.vue文件包含多个组件
 *  4.请书写标准的组件依赖和挂载，暂不支持原生ES5之外的规范
 *  5.组件依赖标准：import MyComponent from 'component/my-component.vue';
 *  6.组件挂载标准：components:{ 'my-component':MyComponent}
 */
var module = {
    cfg:{
        path:'./tpl/',/*组件文件相对地址*/
        container:'router-view',/*模板容器*/
        cssContainer:'vueStyle',/*css容器*/
        componentCssContainer:'componentStyle',
        defaultAssetVersion:window['params']?window.params['assetVersion']:'1.0.0'/*默认前端资源版本号*/
    },
    curVue:null,/*当前渲染的vue对象*/
    vueJSON:{},/*vue组件缓存*/
    /**
     * 修改配置函数
     * @param cfg
     */
    config:function(cfg){
        $.extend(this.cfg,cfg);
    },
    /**
     * 渲染页面
     * @param path 渲染的路径
     * @param el 渲染到的元素[//todo]
     */
    renderPage:function(path,el){
        var that = this;
        this.require([path],function(){
            var v = $.extend(true,{},that.vueJSON[path]);
            that.appendCss([path]);
            delete v.style;
            that.curVue && that.curVue.$destroy(true,true);
            that.curVue = new Vue(v);
            that.curVue.$mount().$appendTo(el||that.cfg.container);
        })
    },
    /**
     * 依赖组件
     * @param urls 依赖组件集合
     * @param callback 回调
     */
    require:function(urls,callback){
        var loading = urls.length;
        if(urls.length<=0){
            loadSuccess();
            return;
        }
        function loadSuccess(){
            loading --;
            loading <=0 && typeof callback == 'function' && callback();
        }
        for(var i=0;i<urls.length;i++){
            /*已加载组件*/
            if(this.vueJSON[urls[i]])
                loadSuccess();
            else
                this.loader(urls[i],function(v){loadSuccess();})
        }
    },
    /**
     * 加载组件
     * @param url
     * @param callback
     */
    loader:function(url,callback){
        //console.log(url);
        var that = this;
        $.ajax({
            url:that.cfg.path + url +'?v='+ that.cfg.defaultAssetVersion,
            dataType:'text',
            method:'get',
            success:function(text){
                if(text){
                    module.parse(text,url,function(){
                        typeof callback=='function' && callback();
                    });
                }else
                    console.log(url+' 内容为空');
            },
            error:function(){
                console.log('网络错误或 '+url+'模板文件不存在');
            }
        });
    },
    /**
     * 解析代码
     * @param text 代码文本
     * @param url 代码文件路径
     * @param callback 回调
     * @returns {boolean}
     */
    parse:function(text,url,callback){
        var that = this;
        /*处理import组件*/
        var exp = /import\s+(\S+)\s+from\s+['"](\S+)['"]/g;
        var importExec = null,importObj={},importUrls=[];
        while(importExec = exp.exec(text)){
            importObj[importExec[1]] = importExec[2];
            importUrls.push(importExec[2]);
        }
        /*处理挂载组件*/
        var componentsExp = /components:\s*\{[\s\S]*?\}/;
        var componentsExec = componentsExp.exec(text);
        //console.log(componentsExec);
        if(componentsExec){/*如果有挂载组件*/
            var cStr = componentsExec[0];
            for(var item in importObj)
                cStr = cStr.replace(item,"'"+importObj[item]+"'");
            text = text.replace(componentsExp,cStr);
        }
        /*取html文本*/
        var templateExec = /<template>([\S\s]*)<\/template>/.exec(text);
        if(!templateExec){
            console.error(url+' 找不到 template');
            return false;
        }
        /*取JS文本*/
        var scriptExec = /<script>[\s\S]*module\.exports\s+=([\S\s]*)<\/script>/.exec(text);
        if(!scriptExec){
            console.error(url+' 找不到 script');
            return false;
        }
        /*转化为JSON对象*/
        var vObj = new Function('','return '+scriptExec[1])();
        vObj['template'] = templateExec[1];
        /*取style*/
        var styleExec = /<style(\s*type="([\s\S]*)")?>([\s\S]*)<\/style>/img.exec(text);
        /*less编译*/
        styleExec || (vObj['style'] = '');
        if(styleExec)
            (styleExec[2] && styleExec[2].trim()=='less/css')//less样式
                ?(window['less']
                    ?less.render(styleExec[3],function(e,output){vObj['style']=output.css})
                    :console.error('请引入Less预编译器'))
                :vObj['style'] = styleExec[3];
        /*缓存组件*/
        this.vueJSON[url] = vObj;
        /*加载依赖组件*/
        this.require(importUrls,function(){
            if(vObj['components'])
                for(var item in vObj.components){
                    //console.log(vObj.components[item]);
                    var path = vObj.components[item];
                    vObj.components[item] = that.vueJSON[path];
                    vObj.style += that.vueJSON[path].style;
                }
            callback();
        });
    },
    /**
     * 添加样式到html
     * @param urls 需要添加的组件地址集合
     * @param isComponent 是否是全局组件
     */
    appendCss:function(urls,isGlobalComponent){
        if(isGlobalComponent){
            $('head').find('#'+this.cfg.componentCssContainer).length>0
            || $('head').append('<style id="'+this.cfg.componentCssContainer+'"></style>');
            $('#'+this.cfg.componentCssContainer).html('');
            for(var i=0;i<urls.length;i++)
                $('#'+this.cfg.componentCssContainer).append(this.vueJSON[urls[i]].style);
        }else{
            $('head').find('#'+this.cfg.cssContainer).length>0 || $('head').append('<style id="'+this.cfg.cssContainer+'"></style>');
            $('#'+this.cfg.cssContainer).html('');
            for(var i=0;i<urls.length;i++)
                $('#'+this.cfg.cssContainer).append(this.vueJSON[urls[i]].style);
        }

    }
}