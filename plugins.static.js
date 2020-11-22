'use strict';
//https://www.npmjs.com/package/uglify-js
//var UglifyJS = require("uglify-js");
//https: //github.com/mishoo/UglifyJS/tree/harmony
var FS = require("fs");
var UglifyJS = require("uglify-es");
var options_ = {
	mangle: {
		toplevel: true,
	},
	nameCache: {}
};


module.exports = {
	apply(compiler) {
		compiler.hooks.emit.tap('compilation', compilation => {

			//不删除plugins
			// if (!(process.argv && process.argv.indexOf('--no-plugins') > -1)) {
			// 	return;
			// }

			// if (process.env.NODE_ENV != 'production') {
			// 	console.log('不压缩');
			// 	return;
			// }
			var allcode = {};
			// 遍历所有资源文件
			for (let filePathName in compilation.assets) { 
				
				if (filePathName.substr(filePathName.length - 3) == '.js' && filePathName.indexOf('/robots/') > 0) {
					//
					;; ///good
				} else {
					console.log('忽略2:' + filePathName);
					continue;
				}

				let content = compilation.assets[filePathName].source() || '';
				content = content.toString('utf-8');

                /* 压缩 */
				var result = UglifyJS.minify(content);
				if (result.error != undefined) {
					console.log('忽略:' + filePathName);
					console.log(result.error); // runtime error, or `undefined` if no error

				} else {
					console.log(filePathName);
					content = result.code;
					//content = RSA.encode(content);
				}

				// 重写指定输出模块内容
				compilation.assets[filePathName] = {
					source() {
						return content;
					},
					size() {
						return content.length;
					}
				};

			} //for
 
		});
	},
};
