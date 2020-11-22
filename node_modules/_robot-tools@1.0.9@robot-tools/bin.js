#!/usr/bin/env node

var argv = process.argv;
 
if(argv[2]=='deploy'){
  require('./deploy.js');
}
if(argv[2]=='init'){
  require('./install_apk.js');
}