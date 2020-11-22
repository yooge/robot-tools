// 全量安装
var utils = require('./install.utils.js');
const version_manager_install = "http://robots.vnool.com:81/app-store/install.php?";
var download_url = '';
var download_ver = '';
var curVersion = "";
//检查直接安装
function checkThenInstall() {
	// #ifndef APP-PLUS
	return; //非手机环境
	// #endif
    plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
        curVersion = wgtinfo.version;
        version.checkVersion((res) => {
            console.log('new version: ' + res.version);
            if (curVersion != res.version) { //准备更新
                // plus.nativeUI.confirm("是否安装更新？", function(e){
                // 	console.log("Close confirm: "+e.index);
                // });
                install((status) => {
                    //
                    //
                });
            }
        });
    });
}
//检查版本
function checkVersion(callback) {
    return checkInfo((res) => {
        console.log(res);
        if (res.err != undefined) {
            console.log(res.err);
            callback('ignore');
            return;
        }
        download_url = res.download;
        download_ver = res.version;
        callback(res);
        return res;
    });
}
//安装
function install(callback) {

    if (!download_url) {
        checkVersion(callback).then(() => {
            do_install(callback);
        })
        return;
    }
    do_install(callback);
}

function do_install(callback) {
    // #ifndef APP-PLUS
	return; //非手机环境
	// #endif
	console.log(download_url);
    utils.installZipUrl(download_url, (status) => {
        if (status == 'ok') {
            uni.setStorageSync('version', download_ver);
            // alert(status);
            //plus.runtime.restart();
            plus.nativeUI.alert("升级完成，重启!", function() {
                plus.runtime.restart();
            });
        } else {
            uni.showToast({
                title: '完成，无更新',
                icon: 'none',
                duration: 3000
            });
        }
        callback(status);
    });
}

function checkInfo(callback) {
    var url = version_manager_install + "app=" + plus.runtime.appid;;
    //console.log(url);
    uni.request({
        url: url,
        type: 'GET',
        success: res => {
            callback(res.data)
        },
        fail: err => {
            console.log('err')
            callback('err')
        }
    })
};
module.exports = {
    checkVersion,
    install,
    checkThenInstall
}