'use strict';
const concat = require('concat-files');
const fs = require('fs');
var destination = (process.argv.slice(2)[0] === 'build' ? './build/custom-sw.js' : './public/custom-sw.js');

if (process.argv.slice(2)[0] === 'build') {
  fs.appendFileSync('./build/service-worker.js', "var dataUrl = 'https://kino.linnuu.com';");
} else {
  fs.appendFileSync('./build/service-worker.js', "var dataUrl = 'http://localhost:9000';");
}

 concat([
   './build/service-worker.js',
   './src/custom-sw.js'
 ], destination, function(err) {
   if (err) throw err
   console.log('done', destination);
 });
