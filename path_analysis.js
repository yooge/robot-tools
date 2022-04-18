const pathAnalysis = {
    // 远程url执行脚本缓存类型
    HttpCacheType: {
        NONE: 0, // 无缓存
        GENERAL: 1, // 有缓存（只储存不强制执行缓存，每次还是会下载）
        COMPEL: 2 // 有缓存（如果发现缓存强制执行缓存不进行下载）
    },
    //准备脚本资源
    prepareResorce: function(obj, readyCall) {
        // 默认为无缓存模式
        if (obj.httpCacheType == undefined) {
            obj.httpCacheType = this.HttpCacheType.NONE;
        }
        if (obj.file == undefined) {
            console.log('请设置机器人脚本');
            return;
        }
        var jsfile = obj.file;
        var dir;
        if (jsfile.toLowerCase().startsWith('http')) { //----- 1.URL
            this.disposeHttpFile(obj).then(file => {
                const localFile = plus.io.convertLocalFileSystemURL(file);
                var pos = localFile.lastIndexOf('/');
                obj.dir = localFile.substr(0, pos);
                obj.file = localFile.substr(pos + 1);
                readyCall(obj);
            })
        } else {
            if (jsfile.startsWith('/')) { //------------------  2. 绝对路径
                var p = jsfile.lastIndexOf('/');
                obj.dir = jsfile.substr(0, p);
                obj.file = jsfile.substr(p+1);  //还是执行自己
            } else { //---------------------------------------- 3.相对路径
                var _entry = jsfile;
                if (jsfile.endsWith('.js')) { //去掉js， Why， 不告诉你
                    _entry = _entry.substr(0, _entry.length - 3);
                }
                obj.arguments._entry = _entry;
                //绝对路径
                obj.dir = plus.io.convertLocalFileSystemURL('static/robots/');
                obj.file = '_entry.js';
                //判断文件是否存在, 不存在就写入一个
                this.checkEntryfile(obj.dir , obj.file);
            }
            readyCall(obj);
        }
    },
    // 处理http地址
    disposeHttpFile: function(obj) {
        // 下载文件并储存
        const downloadFileAndSave = () => {
            return new Promise(res => {
                this._downloadFile(obj, (tmpjsfile) => {
                    switch (obj.httpCacheType) {
                        case this.HttpCacheType.NONE:
                            res(tmpjsfile);
                            break;
                        case this.HttpCacheType.GENERAL:
                        case this.HttpCacheType.COMPEL:
                            uni.saveFile({
                                tempFilePath: tmpjsfile,
                                success: (r) => {
                                    uni.setStorageSync(obj.file, r.savedFilePath);
                                    if (obj.onCacheFile != undefined) {
                                        obj.onCacheFile(r.savedFilePath);
                                    }
                                    res(r.savedFilePath);
                                }
                            })
                            break;
                    }
                })
            })
        }
        // 1，强制缓存模式先读取缓存，无缓存再进行下载
        return new Promise(res => {
            if (obj.httpCacheType === this.HttpCacheType.COMPEL) {
                const cacheFile = uni.getStorageSync(obj.file);
                // 2，判断是否有缓存，无缓存下载有缓存使用
                if (cacheFile) {
                    if (obj.onCacheFile != undefined) {
                        obj.onCacheFile(cacheFile);
                    }
                    res(cacheFile)
                } else {
                    downloadFileAndSave().then((file) => {
                        res(file)
                    })
                }
            } else {
                downloadFileAndSave().then((file) => {
                    res(file)
                })
            }
        })
    },
    /**
     * 下载脚本
     */
    _downloadFile: function(obj, callback) {
        uni.downloadFile({
            url: obj.file,
            header: obj.header || {},
            success: (res) => {
                if (res.statusCode === 200) {
                    callback(res.tempFilePath);
                }
            }
        });
    },
    checkEntryfile: function(dir, file) {
        var that = this;
        var path = dir + file;
		plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fs) {
			// fs.root是根目录操作对象DirectoryEntry
			let a = fs.root.toURL()
			fs.root.getFile(path, {
				create: false
			}, function(fileEntry) {
				//callback(fileEntry);
			}, function(error) {
				console.error(error.message + ", file: "+ file);
				
			}); //fs.root.getFile
			
		}) //plus.io.requestFileSystem
    },
    _entrycode: function() {
        return `
            var fname = app.args._entry;
            var path = './' + fname + '.js';
            console.log('>>>>');
            if (fname == '_blank') {

            } else if (!files.exists(path)) {
                console.log('文件找不到: ' + path);
            } else if (fname) {
                require('./' + fname + '.js');
            }`;
    }
}
module.exports = pathAnalysis;
