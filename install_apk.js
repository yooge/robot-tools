var request = require('request');
var fs = require('fs');
var config = require('./config.js');
 var utils = require('./utils.js');

function downloadFile(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}
var fileUrl = config.server + '/app-store/app-release.apk';
var filename = config.apkpath; //文件名
function startDowload() {
    console.log('-----正在下载(大小:30M)');

    var timer2 = setInterval(() => {
         process.stdout.write('.');
     }, 1011);

    downloadFile(fileUrl, filename, function() {
        clearInterval(timer2);
        console.log("\n[下载完毕] "+filename);
        utils.log("【更新完成】");
    });
}

function start() {
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
}

//start();
module.exports = start;