## 1. 更新apk   
```js
robot-tools init
```
## 2. 发布项目   
```js
robot-tools deploy
```

## 3. 热更新
### 3.1 直接升级
```js
//1. 直接升级
require('robot-tools').version.checkThenInstall();
```
### 3.2 检查，然后升级
```js
const {version} = require('robot-tools');

plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
        curVersion = wgtinfo.version;
        version.checkVersion((res) => {
            console.log('new version: ' + res.version);
            if (curVersion != res.version) { //准备更新
                // plus.nativeUI.confirm("是否安装更新？", function(e){
                // 	console.log("Close confirm: "+e.index);
                // });
                version.install((status) => {
                    //
                    //
                });
            }
        });
    });
```
## 4. API
```js
robot.start(startOption);
```

| 左对齐 | 右对齐 | 居中对齐 |
| :-----| ----: | :----: |
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |
#### 4.1 startOption
| 属性| 类型 | 是否必须 | 描述 |
| :-----| :----- | :----- | :----- |
| file | string | 是 | 脚本文件路径文件路径 |
| httpCacheType | HttpCacheType | 否 | 远程url执行脚本缓存类型 |
| onCacheFile | () => string | 否 | 缓存地址回调 |
| arguments | {} | 否 | json,传递给机器人的参数 |
| onMessage | () => any | 否 | 回调函数，机器人给VUE发送消息 |
#### 4.1.1 HttpCacheType类
```js
HttpCacheType.NONE: 0,				// 无缓存
HttpCacheType.GENERAL: 1,		        // 有缓存（只储存不强制执行缓存，每次还是会下载）
HttpCacheType.COMPEL: 2				// 有缓存（如果发现缓存强制执行缓存不进行下载）
```
