var robot = require('./robots.js');
var install_version = require('./install.version.js');
//var patch = require('./install.patch.js');

var deploy = require('./deploy.js');
var installapk = require('./install_apk.js');
module.exports = {
	robot,
    version: install_version,
    //patch,
    deploy,
    installapk
};