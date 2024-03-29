/*
app, token  用来通知服务器对代码加密的，
*/
//server 加密服务器地址
var server = "http://rpa.shen-x.com";

//hotpatch_server 热更新服务器地址， 你可以替换为你自己的服务器，并上传upload.php 到你的服务器。
var hotpatch_server =  server;
var codepack_server = server;

//
var publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqwEDC2qq+Dg4nwGA+svd
Nr/Dg4Op1vXeD5H00/4J2KxBplfhc9cexGoisRVcH/GyhjPQtynn79ybWfCo5DxR
SiSIoqeB4//JG5c8zsuTaqaKbcyfQjlRelYABRGyqm8cRApg4ZVx6Or7+1AsIMLK
DzykHGCPxww/P00S9NhuKOEak8KXvjtNPUCq+5OMPHBVlYJgMrrfRlRTf87COdA3
Th743Ov2z5kh+V1wPiWU6htXXLA1biXWY0mveXFZIxrz3T2ji6LuZMg0rv9bOhSF
yQFqrP1THLAG2khcLK78muMMFkFMMHBv1Odms1XXpgOn9eMClMRqMCgwfGQ6mlL5
CwIDAQAB
-----END PUBLIC KEY-----`;
var fs = require('fs');
var path = require('path');
eval('global.manifest = ' + fs.readFileSync('./manifest.json', 'utf-8'));
var appid = manifest.appid;
var version = manifest.versionName;
var entry = path.resolve('./static/robots/_entry.js');
//entry = path.resolve('./static/robots/index.js');
//entry = path.resolve('./static/test-pack/index.js');
//console.log(entry);;
var unpackagepath = path.resolve('unpackage/');
var resourcespath = path.resolve('unpackage/resources/');
var outpath = path.resolve('unpackage/resources/' + appid + '/www/static/robots/');
var workpath = path.resolve('unpackage/resources/' + appid);
//var wgtpath = path.resolve('unpackage/resources/' + appid + '.' + version + '.encrypt.wgt');
var wgtpath = path.resolve('unpackage/resources/' + version + '.encrypt.wgt');
var wgtpath4app = path.resolve('unpackage/resources/' + appid+ '.wgt');
var apkpath = path.resolve('unpackage/debug/android_debug.apk');
var wwwpath = workpath + '/www';

//压缩的代码路径，可供开发者自己使用到老项目中
var script_pack_bak = path.resolve('unpackage/resources/'+ appid +'.'+version+'.packed.not-encrypt.js');

function checkManifest(argument) {

  var www_manifest_path =wwwpath + "/manifest.json";
  //console.log(www_manifest_path);

    if (!fs.existsSync(www_manifest_path)) {
        console.log('\u001b[31m[失败]\u001b[0m 请执行菜单: 发行/本地打包/生成本地app资源');
        return false;
    }

   eval('global.wwwmanifest = ' + fs.readFileSync(www_manifest_path, 'utf-8'));
   wwwmanifest.package = manifest.package;
   wwwmanifest.appkey = manifest.appkey;
   wwwmanifest.splash = manifest.splash;
   wwwmanifest.logo = manifest.logo;

   fs.writeFileSync(www_manifest_path, JSON.stringify(wwwmanifest));


   //process.exit();;;
    return true;
}

function writeLine(msg){
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(msg);
}
function writeAppend(msg){
    //process.stdout.clearLine();
    //process.stdout.cursorTo(0);
    process.stdout.write(msg);
}

module.exports = {
    server,
    hotpatch_server,
    codepack_server,
    hotpatch_diy: false,
    publicKey,
    entry,
    outfile: '_entry.js',
    outpath,
    workpath,resourcespath,
    wwwpath,
    wgtpath,wgtpath4app,
    apkpath,
    unpackagepath,
    manifest,
    checkManifest,
    script_pack_bak,
    writeLine, writeAppend
}
