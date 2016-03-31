const match = require('../match');
const loopRoot = require('./loop-root');

module.exports = (root) => loopRoot(root, (option, pattern) => {
  option._pattern = match(pattern);
});
