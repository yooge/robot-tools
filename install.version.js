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

	if (loadingText) {
		uni.showLoading({
			title: '加载中...'
		});
	}

	var curVersion = project.manifest.version.name;
	console.log('当前程序的版本号:' + curVersion);

	checkVersion((res) => {
		console.log('remote version: ' + res.version);
		if (curVersion != res.version) { //准备更新
			// plus.nativeUI.confirm("是否安装更新？", function(e){
			// 	console.log("Close confirm: "+e.index);
			// });
			installViaUrl(res.download, (status) => {
				//
				//
			});
		} else {
			if (loadingText) {
				uni.hideLoading();
			}
		}
	});

}
//检查版本
function checkVersion(callback) {
	var channel = project.manifest.appid; //实际安装的appid
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
function install(callback, url) {
	// #ifndef APP-PLUS
	return; //非手机环境
	// #endif
	return installViaUrl(url, callback);
}
//直接安装URL
function installViaUrl(download_url, callback) {
	if (download_url) {
		do_install(download_url, callback);
		return;
	}

	checkVersion(function(res) {
		console.log('remote version: ' + res.version);
		download_url = res.download;
		do_install(download_url, callback);
	});
	return;
}

function do_install(download_url, callback) {
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
	console.log('not run in app');
	return; //非手机环境
	// #endif 

	//var jsbuf = files.readAssets('apps/__UNI__9D97713/www/manifest.json');
	//var robot = uni.requireNativePlugin('Robot');
	var robot = global.ROBOT_CURRENT.robot;
	//console.log(robot);
	var jsbuf = robot.resource('manifest.json', "utf-8");
	//console.log(jsbuf);
	manifestInfo = JSON.parse(jsbuf);
	manifestInfo.isDebug = global.ROBOT_CURRENT.isDebug;
	return manifestInfo;
}

var project = {};
var _appid;
//读取项目目录的文件
project.resource = function(filename, resolveBack) {
	var mf_path = plus.io.convertLocalFileSystemURL(filename);
	getFileText(mf_path, resolveBack);
}
project.resource('./manifest.json', function(res) {
	project.manifest = (JSON.parse(res));
	project.appid = project.manifest.appid = project.manifest.id;
	project.version_name = project.manifest.version.name;
});;

function getFileText(path, resolveBack) {
	plus.io.requestFileSystem(plus.io.PRIVATE_WWW, fs => { //请求文件系统
			fs.root.getFile(path, {
				create: false //当文件不存在时创建
			}, fileEntry => {
				fileEntry.file(function(file) {
					let fileReader = new plus.io
						.FileReader() //new一个可以用来读取文件的对象fileReader
					fileReader.readAsText(file, 'utf-8') //读文件的格式
					fileReader.onerror = e => { //读文件失败
						console.log('获取文件失败', fileReader.error);
						// plus.nativeUI.toast("获取文件失败,请重启应用", {
						//   background: '#ffa38c',
						// })
						return;
					}
					fileReader.onload = e => { //读文件成功
						let txtData = e.target.result
						resolveBack(txtData) ////回调函数内的值想返回到函数外部  就用promise+resolve来返回出去
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
	isDebug,
	project,
}
// module.exports.prototype.appid = function(){
//    return project.appid;
// }

Object.defineProperty(module.exports, 'appid', {
	get() {
		//console.log('获取')
		return project.manifest.appid;
	},
	// set(newValue) {
	//     console.log('设置')
	//     value = newValue
	// }
});
Object.defineProperty(module.exports, 'name', {
	get() {
		return project.manifest.version.name;
	},
	// set(newValue) {
	//     console.log('设置')
	//     value = newValue
	// }
});
