const fs = require('fs');
const Promise = require('bluebird');
const ini = require('../ini');
const preRoot = require('./pre-root');

// Do NOT use `Promise.promisify`,
// cause we have to stub `fs.readFile` to mock...
const read = (file) => new Promise((resolve, reject) =>
  fs.readFile(file, 'utf-8', (err, data) =>
    err ? reject(err) : resolve(data)
  )
);

module.exports = (rootPath) => read(rootPath, 'utf-8').then(ini.decode).then(preRoot);
