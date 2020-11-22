var request = require('request');
var fs = require('fs');
var config = require('./config.js');

function downloadFile(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}
var fileUrl = config.server + '/app-store/robot.apk';
var filename = config.apkpath; //文件名
function startDowload() {
	console.log(filename + '-----正在下载');
	downloadFile(fileUrl, filename, function() {
	    console.log(filename + '-----下载完毕');
	});
}
try {
	fs.accessSync('unpackage/debug', fs.constants.R_OK | fs.constants.W_OK);
	startDowload();
} catch (err) {
	console.log('正在创键debug文件夹');
	fs.mkdirSync('unpackage');
	fs.mkdirSync('unpackage/debug');
	console.log('创键完成debug文件夹');
	startDowload();
}
