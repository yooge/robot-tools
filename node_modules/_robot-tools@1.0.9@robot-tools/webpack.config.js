//https://www.webpackjs.com/api/node/#%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86-error-handling-

//var webpack = require('webpack');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//const staticJs = require('./plugins.static.js');
//const removeJs = require('./plugins.remove.js');
//const CopyWebpackPlugin = require('copy-webpack-plugin');



var config = require('./config.js');



module.exports = (env, args) => {
	return {
		mode: "production", //production, development
		//target: 'node',
		entry: config.entry,
		output: {
			filename: config.outfile,
			path: config.outpath
		},
		module: {
			rules: [{
					test: /\.(png|jpg|gif|html)$/,
					use: [{
						loader: 'file-loader',
						options: {}
					}]
				},
				//		{
				// 		test: /\.js$/,
				// 		exclude: /(node_modules|bower_components)/, //排除掉node_module目录
				// 		use: {
				// 			loader: 'babel-loader',
				// 			options: {
				// 				presets: ['@babel/preset-env'] ,//转码规则
				// 				//presets: ['es2015']
				// 			},

				// 		}
				// 	}
			]
		},
		//plugins:[removeJs],
		// optimization: {
		// 	minimize: true,
		// 	minimizer: [new UglifyJsPlugin()] //使用自定义压缩工具
		// }
		// plugins: [
		// 	new CopyWebpackPlugin(
		// 		[{
		// 			from: './static/robots/logo.png',
		// 			to: './static/robots/logo.png',
		// 		}]
		// 	)
		// ]


	}
}
