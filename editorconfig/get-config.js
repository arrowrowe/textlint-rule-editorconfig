const getRoot = require('./get-root');
const loopRoot = require('./loop-root');

const sortBy = (array, prop) => array.sort((a, b) => a[prop] - b[prop]);
const clone = require('clone');
const extend = require('extend');
const path = require('node:path');

module.exports = (file) => getRoot(file).then((root) => {
  const options = [];
  loopRoot(root, (option) => {
    if (option._pattern(path.relative(option._dir, file))) {
      options.push(option);
    }
  });
  if (options.length === 0) {
    return Object.create(null);
  }

  sortBy(options, '_priority');
  options.map(clone);
  extend.apply(extend, options);
  const returnValue = options[0];
  delete returnValue._priority;
  delete returnValue._pattern;
  delete returnValue._dir;
  return returnValue;
});
