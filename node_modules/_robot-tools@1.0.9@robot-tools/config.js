/*
app, token  用来通知服务器对代码加密的，
*/
var  server = "http://robots.vnool.com:81";



var publicKey =
	`-----BEGIN PUBLIC KEY-----
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
var entry = path.resolve('./static/robots/index.js');
//entry = path.resolve('./static/robots/index.js');
//entry = path.resolve('./static/test-pack/index.js');

//console.log(entry);;
var outpath = path.resolve('unpackage/resources/' + appid + '/www/static/robots/');

var workpath = path.resolve('unpackage/resources/' + appid);

var wgtpath = path.resolve('unpackage/resources/' + appid + '.' + version + '.encrypt.wgt');

var apkpath = path.resolve('unpackage/debug/android_debug.apk' );

module.exports = {
	server,
	publicKey,
	entry,
	outfile: 'index.js',
	outpath,
	workpath,
	wwwpath: workpath + '/www',
	wgtpath,
	apkpath,
	manifest
}
