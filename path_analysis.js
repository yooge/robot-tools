const pathAnalysis = {
    // 远程url执行脚本缓存类型
    HttpCacheType: {
        NONE: 0, // 无缓存
        GENERAL: 1, // 有缓存（只储存不强制执行缓存，每次还是会下载）
        COMPEL: 2 // 有缓存（如果发现缓存强制执行缓存不进行下载）
    },
    //准备脚本资源
    prepareResorce: function(obj, readyCall) {
        if (obj.arguments == undefined) {
            obj.arguments = {};
        }
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
            if (jsfile.startsWith('/')) { //----- 2. 绝对路径
                var p = jsfile.lastIndexOf('/');
                obj.dir = jsfile.substr(0, p);
                //obj.file = tmpjsfile;  //还是执行自己
            } else { //----- 3.相对路径
                var _entry = jsfile;
                if (jsfile.endsWith('.js')) {
                    _entry = _entry.substr(0, _entry.length - 3);
                }
                obj.dir = plus.io.convertLocalFileSystemURL('static/robots/');
                obj.file = '_entry.js';
                obj.arguments._entry = _entry;
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
    }
}
module.exports = pathAnalysis;