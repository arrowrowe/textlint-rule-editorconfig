import path from 'node:path';
import clone from 'clone';
import extend from 'extend';
import getRoot from './get-root.js';
import loopRoot from './loop-root.js';

const sortBy = (array, prop) => array.sort((a, b) => a[prop] - b[prop]);

const getConfig = (file) => getRoot(file).then((root) => {
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
  options.map((option) => clone(option));
  extend.apply(extend, options);
  const returnValue = options[0];
  delete returnValue._priority;
  delete returnValue._pattern;
  delete returnValue._dir;
  return returnValue;
});

export default getConfig;
