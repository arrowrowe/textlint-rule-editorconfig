import fs from 'node:fs';
import Promise from 'bluebird';
import ini from '../ini.js';
import preRoot from './pre-root.js';

// Do NOT use `Promise.promisify`,
// cause we have to stub `fs.readFile` to mock...
const read = (file) => new Promise((resolve, reject) =>
  fs.readFile(file, 'utf8', (error, data) =>
    error ? reject(error) : resolve(data),
  ),
);

const readRoot = (rootPath) => read(rootPath, 'utf8').then(ini.decode).then(preRoot);

export default readRoot;
