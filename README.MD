## 1. 更新apk   
```
robot-tools init
```
## 2. 发布项目   
```
robot-tools deploy
```

## 3. 热更新
### 3.1 直接升级
```
//1. 直接升级
require('robot-tools').version.checkThenInstall();
```
### 3.2 检查，然后升级
```
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
