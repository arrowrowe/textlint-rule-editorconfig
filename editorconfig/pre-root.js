import match from '../match.js';
import loopRoot from './loop-root.js';

const preRoot = (root) => loopRoot(root, (option, pattern) => {
  option._pattern = match(pattern);
});

export default preRoot;
