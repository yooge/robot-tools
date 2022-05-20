// 全量安装
var utils = require('./install.utils.js');
const version_manager_install = "http://rpa.shen-x.com/app-store/install.php?";
var download_url = '';
var download_ver = '';
var curVersion = "";
//检查直接安装
function checkThenInstall(loadingText) {
	if (loadingText == undefined) {
		loadingText = '加载中...';
	}
	// #ifndef APP-PLUS
	return; //非手机环境
	// #endif

	plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
		//console.log(wgtinfo);

		curVersion = wgtinfo.version;
		var channel = manifest().id; //????

		if (loadingText) {
			uni.showLoading({
				title: '加载中...'
			});
		}

		checkVersion(channel, (res) => {
			console.log('remote version: ' + res.version);
			if (curVersion != res.version) { //准备更新
				// plus.nativeUI.confirm("是否安装更新？", function(e){
				// 	console.log("Close confirm: "+e.index);
				// });
				install((status) => {
					//
					//
				});
			} else {
				if (loadingText) {
					uni.hideLoading();
				}
			}
		});
	});
}
//检查版本
function checkVersion(channel, callback) {
	if (channel == undefined) {
		console.log('channel is not set')
		return false;
	}
	return checkInfo(channel, (res) => {
		//console.log(res);
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
//直接安装
function install(callback) {

	if (!download_url) {
		var channel = manifest().id;
		checkVersion(channel, function(res) {
			console.log('remote version: ' + res.version);
			do_install(callback);
		});
		return;
	}
	do_install(callback);
}

function do_install(callback) {
	// #ifndef APP-PLUS
	return; //非手机环境
	// #endif
	//console.log(download_url);
	utils.installZipUrl(download_url, (status) => {
		if (status == 'ok') {
			uni.setStorageSync('version', download_ver);
			// alert(status);
			//plus.runtime.restart();
			plus.nativeUI.alert("升级完成，请重启!", function() {
				plus.runtime.quit();
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

function checkInfo(channel, callback) {

	var url = version_manager_install + "app=" + channel;;
	console.log(url);
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

function manifest() {
	// #ifndef APP-PLUS
	return; //非手机环境
	// #endif

	//var jsbuf = files.readAssets('apps/__UNI__9D97713/www/manifest.json');
	//var robot = uni.requireNativePlugin('Robot');
	var robot = global.ROBOT_CURRENT.robot;
	//console.log(robot);
	var jsbuf = robot.resource('manifest.json', "utf-8");

	//console.log(jsbuf);

	var manifestInfo = JSON.parse(jsbuf);
	manifestInfo.isDebug = global.ROBOT_CURRENT.isDebug;
	return manifestInfo;
}


var isDebug = 'undefined';
// #ifdef APP-PLUS
isDebug = global.ROBOT_CURRENT.isDebug;
// #endif


module.exports = {
	checkVersion,
	install,
	checkThenInstall,
	manifest,
	isDebug
}
