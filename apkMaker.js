 var fs = require('fs');
 var config = require('./config.js');
 var request = require('request');
 var utils = require('./utils.js');
 //console.log(config.manifest);

 var _wait_dot = '.';

 function make() {
   console.log('  (大概2分钟)');
   //反复检查
   var timer2 = setInterval(() => {
     process.stdout.write(_wait_dot);
   }, 1011);

   var taskstart = () => {
     var timer = setTimeout(() => {
       // process.stdout.clearLine();
       //  console.log('.');
       //  process.stdout.cursorTo(0);
       process.stdout.write(';');
       checkresult((rlt) => {
         if (rlt != 'ok') {
           taskstart();
         } else {
           //good
           clearInterval(timer2);
         }
       })
     }, 3000);
   }
   taskstart();
 }

 function checkresult(callback) {
   var appid = config.manifest.appid;
   var url = config.server + '/app-store/task/apk_ready.' + appid + '.json';
   //console.log(url);
   request.get({
     url,
   }, function(error, response, body) {
     if (error || response.statusCode != 200) {
       //console.log(error);
       callback('bad');
       return;
     }
     console.log('- OK!! -');
     _wait_dot = '>';

     var rlt = JSON.parse(body);
     var fileUrl = rlt.apk_url;
     var ver = config.manifest.versionName;
     var filename = config.unpackagepath + '/' + appid + '.' + ver + '.apk';
     downloadFile(fileUrl, filename, function() {
       callback('ok');
       utils.log("\n5. 【APK打包完成】:");
       utils.log(filename);
       console.log("\n");
     });
   })
 }

 function downloadFile(uri, filename, callback) {
   var stream = fs.createWriteStream(filename);
   request(uri).pipe(stream).on('close', callback);
 }

 function makeLocal(makerpath) {
   fs.copyFileSync(config.wgtpath, config.wgtpath4app);
   var path = config.resourcespath;
   var appid = config.manifest.appid;
   var cmd = "cd " + makerpath + " \n" +
     "php make.php " + appid + ' ' + path;



   var process = require('child_process');

   process.exec(cmd, function(error, stdout, stderr) {
     if (!stderr) {

       console.log("stdout:" + stdout);
       var apkpath = path + "/" + appid + '.apk';
       var verapkpath = path + "/" + config.manifest.name + '-' + config.manifest.versionName + '.apk';
       fs.rename(apkpath, verapkpath,function(){
          utils.log("\n生成apk: " + verapkpath);
       });
     } else {
       console.log("error:" + error);
       console.log("stderr:" + stderr);
     }
   });
 }
 module.exports = {
   make,
   makeLocal
 };
