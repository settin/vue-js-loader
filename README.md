# vue-js-loader 1.0.4
首先，不容置疑的表示vue是个好东西。
但是，我只能说，门槛太高。要会摆弄webpack，硬件配置低了你也玩不转...
然后，我弄出了这个vue-js-loader。

#原理
1.用jquery的ajax加载依赖的组件文本（我很懒，没去写原生的了）
2.解析文本内容，分别提取css,js,html等内容并置入缓存
3.连接依赖相关联的对象
4.director路由到指定的组件，然后从缓存中读取对象生成vue并挂载到DOM


 前置条件：
 
  1.依赖vuejs,jquery 1.7.2 +
  
  2.body内需要建立容器元素<router-view></router-view>
  
  3.推荐director路由
  
 使用样例：
 
  module.renderPage('test.vue');
  
 注意事项：
 
  1.hash路由传参：推荐使用缓存对象值传参，即预先建立一个json对象，该对象内放置一个hash传参专用字段
  
  2.组件嵌套层数尽量减少：由于嵌套组件是阻塞式加载，因此嵌套的层数过多会造成页面加载总时间过长
  
  3.一个.vue文件一个组件：目前的加载逻辑无法处理单个.vue文件包含多个组件
  
  4.请书写标准的组件依赖和挂载，暂不支持原生ES5之外的规范
  
  5.组件依赖标准：import MyComponent from 'component/my-component.vue';
  
  6.组件挂载标准：components:{ 'my-component':MyComponent}
