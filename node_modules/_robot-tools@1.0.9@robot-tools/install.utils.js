function installZipUrl(zipurl, callback) {
	createDownLoad();

	function createDownLoad() {
		//var downURL="file:///storage/emulated/0/wz/";
		var dtask = plus.downloader.createDownload(zipurl, {}, function(d, status) {
			//下载完成
			//alert("bb");
			console.log(d);
			if (status == 200) {
				//alert("Download success:" + d.filename);
				//queryFiles();
				console.log('200');
				install(d.filename, callback);
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
	//安装
	function install(wgt, callback) {
		console.log('start install!!!');
		console.log(wgt);
		plus.runtime.install(wgt, {
			force: true
		}, function() {
			console.log('YYYYYY!!!!!!!!!');
			callback('ok');
		}, function(r) {
			console.log(r);
			console.log('xxxxxx!!!!!!!!!');
			callback('err');
		});
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
}


module.exports = {
	installZipUrl
}
