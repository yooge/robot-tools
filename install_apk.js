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

new Promise(res => {
	fs.open('unpackage', 'r', (err) => {
	  if (err) {
		  fs.mkdirSync('unpackage');
		  console.error('unpackage文件夹创建完成');
		  res();
	  };
	  res();
	});
}).then(() => {
	return new Promise(res => {
		fs.open('unpackage/debug', 'r', (err) => {
		  if (err) {
			  fs.mkdirSync('unpackage/debug');
			  console.error('debug文件夹创建完成');
			  res()
		  };
		  res();
		});
	})
}).then(() => {
	startDowload();
})
