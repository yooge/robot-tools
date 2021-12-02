var robot = require('./robots.js');
var install_version = require('./install.version.js');
//var patch = require('./install.patch.js');
global.ROBOT_CURRENT = robot;
module.exports = {
    robot,
    version: install_version,
    autojs: robot
    //patch,
};
