const Minimatch = require('minimatch').Minimatch;
const path = require('node:path');

const isBasenamePattern = (string_) => !string_.includes('/');

module.exports = (pattern) => {
  const mm = new Minimatch(pattern);
  return isBasenamePattern(pattern)
    ? (file) => mm.match(path.basename(file))
    : mm.match.bind(mm);
};
