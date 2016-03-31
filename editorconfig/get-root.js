'use strict';

const path = require('path');
const Promise = require('bluebird');
const readRoot = require('./read-root');
const extend = require('extend');
const clone = require('clone');

const defaults = require('./defaults');

const parentDir = (dir) => path.resolve(dir, '..');

const getRoot = function (file) {
  return this.getRootByDir(path.dirname(file));
};

const dirCache = getRoot.dirCache = Object.create(null);

const loopRoot = require('./loop-root');
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

const _getRootByDir = getRoot._getRootByDir = function (dir) {
  return readRoot(path.resolve(dir, '.editorconfig'))
    .catch(() =>
      dir === '/' ? defaults : this.getRootByDir(parentDir(dir))
    )
    .then((options) =>
      (options.root || (dir === '/')) ?
        options :
        this.getRootByDir(parentDir(dir)).then(
          (optionParent) => extend(true, clone(optionParent), ensurePriority(options))
        )
    );
};

const getRootByDir = getRoot.getRootByDir = function (dir) {
  return dir in this.dirCache ?
    Promise.resolve(this.dirCache[dir]) :
    this._getRootByDir(dir).tap((root) => {
      this.dirCache[dir] = root;
    });
};

module.exports = getRoot.bind(getRoot);
module.exports.dirCache = dirCache;
module.exports._getRootByDir = _getRootByDir;
module.exports.getRootByDir = getRootByDir;
