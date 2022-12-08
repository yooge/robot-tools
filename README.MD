## 本项目为uni-app的应用程序，提供模拟点击控制安卓手机的能力。
 
## 安装
```
npm i robot-tools
```


### 更详细的文档,请查看：

[更详细的文档](https://yooge.github.io/robot-docs/autojs-vue.html)

https://yooge.github.io/robot-docs/autojs-vue.html


## 1. 更新/下载基座
```js
robot-tools init
```
Hbuilder的菜单：运行 -> 手机或模拟器 -> 运行基座选择 -> 自定义基座(勾选)



## 2. 在项目中使用
```js
var {robot} = require('robot-tools');
var param = { 
    file: 'demo.js', //机器人脚本(static/robots/目录下)，或绝对路径/sdcard/xxx.js，或远程URL(也可以用发布的打包加密代码)
    vue:  this, //可选, 将本vue对象传递给机器人
    arguments: {}, //可选, json,传递给机器人的参数。[提示]如果不传递，则系统会默认使用'当时'的vue的data数据
    onMessage: ()=>{} //回调函数，机器人给VUE发送消息， 感觉快淘汰了
}
robot.stop();
//启动机器人
robot.start(param); 

```
```js
/*

file:  
//1. 脚本脚本(static/robots/目录下的demo.js)，
//2. 或绝对路径/sdcard/xxx.js，
//3. 或远程URL(也可以用发布的打包加密代码)

arguments: 
//可选, json,传递给脚本的参数。
//可以在控制脚本脚本中用app.args获取
//如果不传递参数，则系统会默认传递'当时'的vue的$data数据；
//如果控制脚本想动态获取vue的$data的数据，请往下看
*/

//启动脚本
autojs.start(param); 

//停止脚本
autojs.stop();

//仅设置初始化参数，不执行代码
autojs.init(param); 
//根据上面设置好的参数，执行代码； 也可以在悬浮脚本上点启动按钮
autojs.start(); 

autojs.menu.show(); //显示悬浮脚本图标 
autojs.menu.move(x,y); //移动悬浮脚本图标
autojs.menu.close(); //隐藏悬浮脚本图标
autojs.showMenu(param); //执行脚本并显示脚本图标



var isEnabled = autojs.permission();//检查是否启动了无障碍


//在当前已经运行的脚本的上下文中执行
autojs.eval(代码或函数);

//在新是脚本上下文执行
autojs.exec(代码或函数);

```
#### 机器人脚本,请参考 https://github.com/yooge/robot
.
.

#### 机器人获取VUE发过来的参数(启动机器人时传递的)
```js
app.args //json对象
app.arguments
```
#### 机器人给VUE层发消息
```js
app.post2host("message"); //机器人用这个方法给VUE层发消息
```

#### 机器人脚本直接访问VUE页面对象
```js
app.vue  //机器人直接访问vue的对象，上面传递进来的对象this(或别的对象)
app.vue.abc   //访问data里的abc变量
app.vue.abc = 999; //给data里面的abc赋值
app.vue.test() //访问methods里面的 test函数。 此用法可以淘汰上面的onMessage回调

```


## 3. 发布项目
默认使用本项目的热更新服务器
```js
robot-tools deploy   //生成apk
robot-tools deploy apk=false  //不生成apk
```
过程：  
* 1. 压缩，混淆，（将你的工程代码进行压缩，混淆）
* 2. 加密，将代码进行加密操作
* 3. 制作热补丁并上传

#### 3.2 自定义热更新服务器
```js 
robot-tools deploy apk=false server=default
robot-tools deploy apk=false server=http://abc.com/
```
请上传upload.php 到你的服务器位置 http://abc.com/app-store/upload.php  
wgt文件就会存到你的服务器上
然后在代码中使用  version.install(callback, url_wgt);

## 4. 热更新
### 4.1 直接升级
```js
//1. 直接升级
require('robot-tools').version.checkThenInstall();
```
### 4.2 检查，然后升级
```js
const {version} = require('robot-tools');

 uni.showLoading({
       title: '加载中...'
  });
version.checkVersion((res) => {
	console.log('current version: ' + version.name);
	console.log('remote version: ' + res.version);
	if (version.name != res.version) { //准备更新
		// plus.nativeUI.confirm("是否安装更新？", function(e){
		// 	console.log("Close confirm: "+e.index);
		// });
		version.install(res.download, (status) => {
			//
			//
		});
	} else {
		if (loadingText) {
			uni.hideLoading();
		}
	}
});
	
 
```

## 5. API
```js
robot.start(startOption);
```
#### 4.1 startOption
| 属性| 类型 | 是否必须 | 描述 |
| :-----| :----- | :----- | :----- |
| file | string | 是 | 脚本文件路径文件路径(机器人脚本(static/robots/目录下)，或绝对路径/sdcard/xxx.js，或远程URL, 可以用发布的打包加密代码) |
| httpCacheType | HttpCacheType | 否 | 远程url执行脚本缓存类型 |
| arguments | {} | 否 | json,传递给机器人的参数 |
| header | Object | 否 | HTTP 请求 Header, header |
| onCacheFile | () => string | 否 | 缓存地址回调 |
| onMessage | () => any | 否 | 回调函数，机器人给VUE发送消息 |
#### 4.1.1 HttpCacheType类
```js
HttpCacheType.NONE: 0,				// 无缓存
HttpCacheType.GENERAL: 1,		        // 有缓存（只储存不强制执行缓存，每次还是会下载）
HttpCacheType.COMPEL: 2				// 有缓存（如果发现缓存强制执行缓存不进行下载）
```
