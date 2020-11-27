#!/usr/bin/env node

var argv = process.argv;
if (argv[2] == 'deploy') {
    var deploy = require('./deploy.js');
    if (argv[3] != undefined && argv[3].startsWith('http')) {
        deploy(argv[3]);
    } else {
        deploy();
    }
}
if (argv[2] == 'init') {
    var install = require('./install_apk.js');
    install();
}