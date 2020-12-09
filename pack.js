 var fs = require('fs');
 var webpack = require('webpack');
 var config = require('./config.js');
 var webconfig = require('./webpack.config.js');

 function makePack(done) {
     var webpack_configs = webconfig();
     const compiler = webpack(webpack_configs, (err, stats) => {
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
         var bak = config.script_pack_bak;
         //copy file
         fs.writeFileSync(bak, fs.readFileSync(out));
         console.log('   混淆后的文件: ' + bak);
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