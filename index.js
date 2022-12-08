var robot = require('./robots.js');
if(typeof(global)=='undefined'){global=getApp().globalData;}

global.ROBOT_CURRENT = robot;
//注意： 先定义robot，然后 version
var install_version = require('./install.version.js');
//var patch = require('./install.patch.js');

module.exports = {
    robot,
    version: install_version,
	project: install_version.project,
    autojs: robot
    //patch,
};
