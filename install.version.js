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

	var appid = plus.runtime.appid;
	var appid2 = manifest().id; //使用包内的appid
	if (appid2) appid = appid2;

	plus.runtime.getProperty(appid, (wgtinfo) => {
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
/*
async function savedManifest() {
	var mf_path = plus.io.convertLocalFileSystemURL('./manifest.json');
	var x = await getFileText(mf_path);
}


function getFileText(path) {
	return new Promise(resolve => { //文件读写是一个异步请求 用promise包起来方便使用时的async+await
		plus.io.requestFileSystem(plus.io.PRIVATE_WWW, fs => { //请求文件系统
				fs.root.getFile(path, {
					create: false //当文件不存在时创建
				}, fileEntry => {
					fileEntry.file(function(file) {
						let fileReader = new plus.io
						.FileReader() //new一个可以用来读取文件的对象fileReader
						fileReader.readAsText(file, 'utf-8') //读文件的格式
						fileReader.onerror = e => { //读文件失败
							console.log('获取文件失败', fileReader.error)
							// plus.nativeUI.toast("获取文件失败,请重启应用", {
							//   background: '#ffa38c',
							// })
							return;
						}
						fileReader.onload = e => { //读文件成功
							let txtData = e.target.result
							resolve(txtData) ////回调函数内的值想返回到函数外部  就用promise+resolve来返回出去
						}
					})
				}, error => {
					console.log('2新建获取文件失败', error)
					// plus.nativeUI.toast("获取文件失败,请重启应用", {
					//   background: '#ffa38c',
					// });
					return;
				})
			},
			e => {
				console.log('1请求文件系统失败', e.message)
				// plus.nativeUI.toast("请求系统失败,请重启应用", {
				//   background: '#ffa38c',
				// });
				return;
			}
		);
	});
}
*/

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
