<style>
    html,body{ padding:0; margin:0;}
    .container{ padding: 10px;}
</style>

<template>
    <my-header title="测试页面"></my-header>
    <div class="container">
        <a href="#/test1">测试页面一</a><br>
        <my-tabs :data="tabs"></my-tabs>
    </div>
</template>

<script>
    import MyTabs from 'component/my-tabs.vue';
    module.exports = {
        components:{
            'my-tabs':MyTabs
        },
        data: function () {
            return {
                tabs:['一','二','三','四','五']
            }
        }
    }
</script>