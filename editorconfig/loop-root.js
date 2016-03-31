'use strict';

module.exports = (root, fn) => {
  /* eslint-disable prefer-const */
  // MUST use `let` here......
  for (let pattern in root) {
    if (pattern === 'root') {
      continue;
    }
    fn(root[pattern], pattern, root);
  }
  return root;
};
