/*
  *** 用法 ****
var robot = require('@/robots/robots.js');

//
param = { dir, file, arguments  onMessage:(){}, menuOnly}


//强制停止机器人
robot.start(param);
robot.showMenu();
robot.stop();
robot.exec(function(){...});

*/
var pathAnalysis = require('./path_analysis.js');
var ROBOT = {};
(function() {
    // #ifndef APP-PLUS
    return;
    //#endif
    var robot;
    robot = global.robot = uni.requireNativePlugin('Robot');
    robot.init(plus.runtime.appid, (msg) => {
        console.log("[init] -> " + msg);
        if (msg != 'fail') {
            return; //good
        }
        uni.showModal({
            title: '提示',
            content: 'App认证失败',
        });
    });
    ROBOT = {
        robot: robot,
        isready: false,
        permission: () => {},
        start: () => {},
        stop: () => {},
    };
    Object.assign(ROBOT, pathAnalysis);
})(); //

/**
 * @param {Object} {
 *  file: String,   					        // 文件地址
 * 	httpCacheType?: HttpCacheType,		// 缓存类型
 * 	header: Object,						        // HTTP 请求 Header, header
 * 	onCacheFile?: () => string			  // 缓存地址回调
 * }
 */
ROBOT.start = function(obj) {
    var that = this;
    // #ifndef APP-PLUS
    return; //非手机环境
    // #endif
    //准备脚本资源
    this.prepareResorce(obj, (params) => {
        that.params = params;
        
        console.log('readyCall ....');
        // console.log( JSON.stringify(params));  请关闭 传入的vue对象后，再打印
        //
        that.robot.setJsDir(params.dir);
        that.robot.setJsFile(params.file);
        that.robot.setJsArguments(JSON.stringify(params.arguments));
        that.robot.setJsCallback(function(data) {
            var rlt = that.vueCallback(data);
            that.robot.backVueData(rlt);
            return rlt;
        });
        that.robot.startMenu();
        if (params.startAtMenu == true) {
            var nothing_; //not start
        } else {
            that.robot.start();
        }
        
        return that;
    })
}

ROBOT.showMenu = function(obj) {
    obj.startAtMenu = true; //只显示菜单，不执行
    obj.arguments.startAtMenu = true;
    this.start(obj);
    uni.showToast({
        icon: 'none',
        title: '请从悬浮机器人处启动',
        duration: 2000
    });
}
ROBOT.exec = function(fun) {
    var code = fun.toString();
    if (typeof(fun) == 'function') {
        code = "(" + code + ")();"
    }
    code += "; var __f__=function(tag, msg, file){ console.log(msg)}";
    console.log(code);
    this.robot.exec(code);
}
ROBOT.permission = function() {
    console.log(" robot.permission: ");
    var b = this.robot.permission();
}
ROBOT.stop = function() {
    // #ifndef APP-PLUS
    return; //非手机环境
    //#endif
    if (this.robot == null) {
        return;
    }
    this.robot.stop();
}
String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}
ROBOT.vueCallback = function(data) {
    //console.log(JSON.stringify(data));
    var obj = this.params;
    var js;
    try {
        js = JSON.parse(data);
    } catch (e) {
        return;
    }
    var error = js.error;
    if (error != undefined && error.indexOf('permission') > -1) {
        //---that.permission();
        js.status = "error"
        //data = JSON.stringify(js)
        return;
    }
    if (!js.__prop) {
        if (obj.onMessage != undefined) {
            return obj.onMessage(js);
        }
    }
    if (js.__prop) { //属性访问，函数调用
        if (js.__type == 'function') { //直接调用
            var new_args = [];
            var args = (js.__arguments);
            for (var k in args) {
                new_args.push(args[k]);
            }
            return obj.vue[js.__prop].apply(null, new_args);
        } else if (js.__type == 'set') {
            //console.log(js.__arguments);
            try {
                return obj.vue[js.__prop] = js.__arguments["0"];
            } catch (e) {
                return obj.vue[js.__prop] = js.__arguments
            }
        } else if (js.__type == 'get') {
            return obj.vue[js.__prop];
        }
    }
}
module.exports = ROBOT;
