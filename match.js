const Minimatch = require('minimatch').Minimatch;
const path = require('path');

const isBasenamePattern = (str) => str.indexOf('/') === -1;

module.exports = (pattern) => {
  const mm = new Minimatch(pattern);
  return isBasenamePattern(pattern) ?
    (file) => mm.match(path.basename(file)) :
    mm.match.bind(mm);
};
