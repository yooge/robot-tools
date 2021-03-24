#!/usr/bin/env node

/*
node deploy server=http://....  apk=false

*/
var argv = process.argv;
var cfgs = params(argv);
if (argv[2] == 'deploy') {
    var deploy = require('./deploy.js');
    deploy(cfgs);
}
if (argv[2] == 'init') {
    var install = require('./install_apk.js');
    install();
}

function params(argvs) {
    var vars = {};
    for (var i = 0; i < argvs.length; i++) {
        var kv = argvs[i].split('=');
        var k = kv[0].trim();
        var v = kv[1] ? kv[1].trim() : '';
        vars[k] = v;
    }
    return vars;
}