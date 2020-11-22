var robot = require('./robots.js');
var install_version = require('./install.version.js');
var patch = require('./install.patch.js');
module.exports = {
	robot,
    version: install_version,
    patch
};