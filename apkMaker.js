 var config = require('./config.js');
 var request = require('request');

 function make() {
     //反复检查
     var timer = setTimeout(() => {
         checkresult((rlt) => {
             if (rlt != 'ok') {
                 make();
             } else {
                 //good
             }
         })
     }, 3000);
 }

 function checkresult(callback) {
     var appid = config.manifest.id;
     request.get({
         url: config.server + '/data/' + appid + '.apk_ready.json',
     }, function(error, response, body) {
         if (error || response.statusCode != 200) {
             console.log(error.code);
             callback('bad');
             return;
         }
         console.log(body);
         var rlt = JSON.parse(body);
         
         var fileUrl = rlt.apk_url;
         var ver = config.manifest.version.name;
         var filename = config.unpackagepath + '/' + appid + '.' + ver + '.apk';
         downloadFile(fileUrl, filename, function() {
             console.log('【打包完成】:');
             console.log(filename);
         });
         callback('ok');
     })
 }

 function downloadFile(uri, filename, callback) {
     var stream = fs.createWriteStream(filename);
     request(uri).pipe(stream).on('close', callback);
 }
 module.exports = {
     make
 };