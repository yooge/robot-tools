var fs = require('fs');
var request = require('request');
var pack = require('./pack.js');
var path = require('path');
const compressing = require('compressing');
var config = require('./config.js');
//const RSA = require('./rsa.js');
if (!fs.existsSync(config.wwwpath + "/manifest.json")) {

   console.log('\u001b[31m[失败]\u001b[0m 请执行菜单: 发行/本地打包/生成本地app资源');
   return;
}
//删除out目录的js文件
delDir(config.outpath);
console.log('1. 压缩...');
//打包
pack.makePack(() => {
    var out = config.outpath + '/' + config.outfile;
    var content = fs.readFileSync(out);
    //content = RSA.encode(content);
    // var logo = fs.readFileSync(path.resolve('kits/logo.png'));
    // fs.writeFileSync(out + '.png', logo +"\n\n"+ content);
    //fs.writeFileSync(out, '/*hello*/'+content);
    //console.log(out);;
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
        //检查www路径的文件
        compressing.zip.compressDir(config.wwwpath+'/', config.wgtpath, {ignoreBase:true}).then(() => {
            console.log('  ' + config.wgtpath);;
            uploadPack(config.wgtpath);
        }).catch(err => {
            console.error(err);
        });
    })
});

function uploadPack(wgtpath) {
    console.log('3. 更新/升级...');
    var formData = {
        "manifest": JSON.stringify(config.manifest),
        "file": fs.createReadStream(wgtpath),
    };
    request.post({
        url: config.server + '/app-store/upload.php',
        formData: formData
    }, function(error, response, body) {
        console.log(body);
        console.log(' \u001b[32m [完成]!!\u001b[0m ');
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