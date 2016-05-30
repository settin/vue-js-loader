/**
 * Created by wangyong on 14-10-28.
 */

/**
 * 判断是否为数组
 * @param obj
 * @returns {boolean}
 */
;var isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

if (!Array.prototype.filter) {
    /**
     * 过滤数组中的元素
     *
     * @param fun
     * @returns {Array}
     */
    Array.prototype.filter = function(fun /*, thisp*/){
        var len = this.length;

        if (typeof fun == "function"){
            var res = new Array();
            var thisp = arguments[1];
            for (var i = 0; i < len; i++){
                if (i in this){
                    var val = this[i]; // in case fun mutates this
                    if (fun.call(thisp, val, i, this)) {
                        res.push(val);
                    }
                }
            }
            return res;
        }else{
            /*console.log([this,fun]);
            return null;*/
            //throw new TypeError();
        }

    };
};




if(!Array.prototype.inArray){
    Array.prototype.inArray = function(str){
        for(var i in this)
            if(this[i] === str) return true;
        return false;
    }
}
if(!String.prototype.trim) {
    /**
     * IE不支持trim函数的兼容方法
     * @returns {string}
     */
    String.prototype.trim = function(){
        return this.replace(/^\s|\s$/g,'');
    }
};

/**
 * 数据转换
 * @param data 对象或对象数组
 * @param config 配置
 * @returns {*}
 * [{
        name:'王勇',
        tel:'13533334381'
    },{
        name:'张三',
        tel:'110'
    }],{
        name:'userName',
        tel:{
            toName:'mobile',
            type:'int'
        }
}
 */
function dataChange(data,config){
    //console.log(typeof data);
    function changeObj(data,cfg){
        var reData = {};
        for(var item in data){
            var toName = typeof cfg[item]=='string'?cfg[item]:cfg[item].toName;
            var type = typeof cfg[item]=='string'
                ?null
                :cfg[item]['type']
                ?cfg[item]['type']
                :null;
            switch (type){
                case 'int':reData[toName]       = parseInt(data[item]);break;
                case 'float':reData[toName]     = parseFloat(data[item]);break;
                case 'boolean':reData[toName]   = !!data[item];break;
                default:reData[toName]          = data[item]+'';break;
            }
        }
        return reData;
    }

    if(isArray(data)){
        var reData = [];
        for(var i=0;i<data.length;i++)
            reData.push(changeObj(data[i],config));
        return reData;
    }else
        return changeObj(data,config);
}