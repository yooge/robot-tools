var webpack = require('webpack');

var config = require('./webpack.config.js');

function makePack(done) {
	var configs = config();
	const compiler = webpack(configs, (err, stats) => {
		if (err) {
			console.error(err.stack || err);
			if (err.details) {
				console.error(err.details);
			}
			return;
		}

		const info = stats.toJson();

		if (stats.hasErrors()) {
			console.error(info.errors);
		}

		if (stats.hasWarnings()) {
			console.warn(info.warnings);
		}
        
        var out = config.outpath + '/' + config.outfile;
        console.log('   混淆后的文件: ' + out);

		done();
	});

	// compiler.run((err, stats) => {
	//   if (err) {
	//       console.log('err:', err)
	//   }else{
	//   	 console.log('g8888888d')
	//   }
	// });
	 
}

module.exports = {
	makePack
}
