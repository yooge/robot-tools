const VERSION = "07504484b50";;

import Request from './request.js'
var utils = require('./install.utils.js');
const APP_NAME = 'robot-center-script';
const version_manager_url = "http://robots.vnool.com:81/app-store/patch.php?";
const version_manager_install = "http://robots.vnool.com:81/app-store/install.php?";

function reinstall(callback) {

	//checkDiff(version).then((res) => {
	checkInstall().then((res) => {
		if (res.err != undefined) {
			console.log(res.err);
			callback('ignore');
			return;
		}
		utils.installZipUrl(res.download, (status) => {
			if (status == 'ok') {
				uni.setStorageSync('version', res.version);
				// alert(status);
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

	});
}

function upgrade(callback) {
	var version = uni.getStorageSync('version');
	//if (!version) version = VERSION;

	//checkDiff(version).then((res) => {
	checkfull().then((res) => {
		if (res.err != undefined) {
			console.log(res.err);
			callback('ignore');
		} else {
			utils.installZipUrl(res.diffFile, (status) => {
				if (status == 'ok') {
					uni.setStorageSync('version', res.hostVer);
					// alert(status);
					plus.nativeUI.alert("升级完成，重启!", function() {
						plus.runtime.restart();
					});
				} else {
					//err
				}
				callback(status);
			});
		}
	});
}

function checkInstall() {
	var url = version_manager_install + "app=" + APP_NAME;
	console.log(url);
	return Request("", url, "GET");
};

function checkfull() {
	var url = version_manager_url +
		"clientVer=000&action=fullpackage&app=" + APP_NAME;
	console.log(url);
	return Request("", url, "GET");
};

function checkDiff(version) {
	var url = version_manager_url +
		"clientVer=" + version + "&action=diffpackage&app=" + APP_NAME;
	console.log(url);
	return Request("", url, "GET");
};

function remoteVersion() {
	var url = version_manager_url +
		"clientVer=000&action=appversion&app=" + APP_NAME;
	console.log(url);
	return Request("", url, "GET");
};




module.exports = {
	upgrade,
	remoteVersion
}
