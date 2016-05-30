<style type="less/css">
    .tabs{ display: inline-block; border:1px solid #04ba63; border-radius: 5px;
        span{ display: inline-block; border-right: 1px solid #04ba63; line-height: 20px; padding:0 10px;
            &:last-child{border:none;}
            &:hover{ background: #04ba63; color: #ffffff; cursor: default;}
        }
    }
</style>

<template>
    <div class="tabs">
        <span v-for="item in data">{{item}}</span>
    </div>

</template>

<script>
    module.exports = {
        data: function () {
            return {}
        },
        props:['data']
    }
</script>