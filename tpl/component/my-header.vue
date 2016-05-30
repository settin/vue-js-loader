
<style type="less/css">
    header{ background:#04ba63;
        h1{ color: #fff; font-weight:500; text-align: center; height: 2.5rem; line-height:2.5rem; font-size:1rem;}
    }
</style>

<template>
    <header>
        <h1>{{title}}</h1>
    </header>
</template>

<script>
    module.exports = {
        data: function () {
            return {}
        },
        props:['title']
    }
</script>