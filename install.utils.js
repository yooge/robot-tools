//安装远程WGT
function installZipUrl(zipurl, callback) {
	downloadZipUrl(zipurl, (info)=>{
		install(info.filename, callback);
	}) 
}
//直接运行WGT
function runWgtUrl(wgturl, callback) {
	downloadZipUrl(wgturl, (info)=>{
		 //runnnnn ->
		 console.log("TODOOOO--> 运行wgt");
		 callback();;
	}) 
}
//安装
function install(wgt, callback) {
	console.log('start install!!!');
	//console.log(wgt);
	plus.runtime.install(wgt, {
		force: true
	}, function() {
		//console.log('YYYYYY!!!!!!!!!');
		callback('ok');
	}, function(r) {
		console.log(r);
		console.log('xxxxxx!!!!!!!!!');
		callback('err');
	});
}

function downloadZipUrl(zipurl, callback) {

	//var downURL="file:///storage/emulated/0/wz/";
	var dtask = plus.downloader.createDownload(zipurl, {}, function(info, status) {
		//下载完成
		//alert("bb");
		//console.log(d);
		if (status == 200) {
			//alert("Download success:" + d.filename);
			//queryFiles();
			//console.log('200');
			//install(d.filename, callback);
			callback(info);
		} else {
			console.log("Downlaod failed:" + status);
		}
	}, function(e) {
		console.log(e.Message);
	});
	// dtask.addEventListener('statechanged',function(d,status){  

	//     console.log("statechanged: "+d.state);  

	// });  
	dtask.start();

}

//然后通过queryFile是进行_downlaods文件的遍历找到没有解压的zip文件
/*
	function queryFiles() {
		plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
			var directoryReader = fs.root.createReader();
			directoryReader.readEntries(function(entries) {
				var fileArray = new Array();
				for (var i = 0; i < entries.length; i++) {
					fileArray[i] = entries[i].name;
					decompress(entries[i].toURL());
				}
			}, function(e) {
				alert("queryFile" + e.message);
			});
		});
	}
	//然后把没有解压成功的zip文件进行解压

	function decompress(zipFileName) {
		var zipFile = zipFileName;
		var targetPath = '_doc/';
		console.log(zipFile);
		plus.zip.decompress(zipFile, targetPath,
			function() {
				alert("success");
			},
			function(errors) {
				alert("++" + errors.Message + "failed");
			});
	}

*/
function getFileText(path, resolveBack) {
	plus.io.requestFileSystem(
		plus.io.PRIVATE_WWW,
		fs => { //请求文件系统
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

module.exports = {
	installZipUrl,
	install,
	getFileText
}
