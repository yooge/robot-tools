/*

压缩，加密代码，发布热更新，生成安卓apk包

如果想用你自己的热更新服务器，请修改config.js文件里面的 
hotpatch_server 变量为你自己的服务器地址。

*/

var fs = require('fs');
var request = require('request');
var pack = require('./pack.js');
var path = require('path');
const compressing = require('compressing');
var config = require('./config.js');
var apkmaker = require('./apkMaker.js');

function start() {
    //const RSA = require('./rsa.js');
    if (!fs.existsSync(config.wwwpath + "/manifest.json")) {
        console.log('\u001b[31m[失败]\u001b[0m 请执行菜单: 发行/本地打包/生成本地app资源');
        return;
    }
    encode(() => {
        //1. 压缩上传热更新补丁
        console.log('3. 更新/升级热补丁 ...');
        packUpload(() => {
            //2. 生成本地正式版APK 
            console.log('4.\u001b[31m 本地生成正式版APK （12月15日上线, 此前请找群主索取，QQ群: 1037025652）\u001b[0m ');
            console.log('');
            //apkmaker.make();
            //;; 
        });
        //
    });
}
// 压缩上传热更新补丁
function packUpload(donecall) {
    compressing.zip.compressDir(config.wwwpath + '/', config.wgtpath, {
        ignoreBase: true
    }).then(() => {
        console.log('  ' + config.wgtpath);;
        //上传
        uploadPack(config.wgtpath, donecall);
    }).catch(err => {
        console.error(err);
    });
}

function encode(callback) {
    //删除out目录的js文件
    delDir(config.outpath);
    //打包
    console.log('1. 压缩...');
    pack.makePack(() => {
        var out = config.outpath + '/' + config.outfile;

        var content = fs.readFileSync(out);
        //content = RSA.encode(content); 
        console.log('2. 加密...');
        request.post({
            url: config.server + '/app-license/robot-code-pack2.php',
            form: {
                "manifest": JSON.stringify(config.manifest),
                "data": content
            }
        }, function(error, response, body) {
            if (error || response.statusCode != 200) {
                console.log(error.code);
                return;
            }
            fs.writeFileSync(out, body);
            console.log('   加密后的脚本文件: ' + out);
            ////
            callback();
        })
    });
}
//console.log('3. 更新/升级热补丁 ...');
function uploadPack(wgtpath, donecall) {
    var formData = {
        "manifest": JSON.stringify(config.manifest),
        "file": fs.createReadStream(wgtpath),
    };
    request.post({
        url: config.hotpatch_server + '/app-store/upload.php',
        formData: formData
    }, function(error, response, body) {
        //console.log(body);
        console.log(' \u001b[32m  [已上传到热更新服务器]!!\u001b[0m ');
        //console.log(' \u001b[32m [完成]!!\u001b[0m ');
        donecall();
    })
}

function delDir(path) {
    //console.log(path);
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                if (curPath.endsWith('.js')) {
                    fs.unlinkSync(curPath); //删除文件
                }
            }
        });
        try {
            fs.rmdirSync(path)
        } catch (err) {;
        }
    }
}
//start();
module.exports = start;