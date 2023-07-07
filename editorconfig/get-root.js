import path from 'node:path';
import Promise from 'bluebird';
import extend from 'extend';
import clone from 'clone';
import readRoot from './read-root.js';
import defaults from './defaults.js';
import loopRoot from './loop-root.js';

const parentDir = (dir) => path.resolve(dir, '..');

const getRoot = function (file) {
  return getRootByDir(path.dirname(file));
};

const dirCache = Object.create(null);
getRoot.dirCache = dirCache;

const getLargestPriority = (root) => {
  let largest = -1;
  loopRoot(root, (option) => {
    if (option._priority > largest) {
      largest = option._priority;
    }
  });
  return largest;
};

const ensurePriority = (root) => {
  const delta = 1 + getLargestPriority(root);
  return delta ? loopRoot(root, (option, pattern) => {
    root[pattern]._priority -= delta;
  }) : root;
};

const _getRootByDir = function (dir) {
  return readRoot(path.resolve(dir, '.editorconfig'))
    .catch(() =>
      dir === '/' ? defaults : getRootByDir(parentDir(dir)),
    )
    .then((options) => {
      for (const k in options) {
        if (typeof options[k] === 'object') {
          options[k]._dir = dir;
        }
      }

      return options;
    })
    .then((options) =>
      (options.root || (dir === '/'))
        ? options
        : getRootByDir(parentDir(dir)).then(
          (optionParent) => extend(true, clone(optionParent), ensurePriority(options)),
        ),
    );
};

getRoot._getRootByDir = _getRootByDir;

const getRootByDir = function (dir) {
  return dir in dirCache
    ? Promise.resolve(dirCache[dir])
    : _getRootByDir(dir).tap((root) => {
      dirCache[dir] = root;
    });
};

getRoot.getRootByDir = getRootByDir;

export default getRoot;
export {dirCache, _getRootByDir, getRootByDir};
