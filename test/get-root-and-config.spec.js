import test from 'ava';
import {stub} from 'sinon';
import Promise from 'bluebird';
import clone from 'clone';
import fs from 'fs';

import samples from './samples';

import loopRoot from '../editorconfig/loop-root';
import getRoot from '../editorconfig/get-root';
import defaults from '../editorconfig/defaults';
import getConfig from '../editorconfig/get-config';

import sortKeys from 'sort-keys';
// Do NOT use `t.same` directly.
// See also [sindresorhus/ava#617](https://github.com/sindresorhus/ava/issues/617).
const same = (t, a, b) => t.same(sortKeys(a), sortKeys(b));

test.before('Stub `fs.readFile`', () => {
  stub(fs, 'readFile', (file, options, callback) => {
    const data = samples[file];
    if (data) {
      callback(null, data);
    } else {
      callback('File not found!');
    }
  });
});

test.after('Restore `fs.readFile`', () => {
  fs.readFile.restore();
});

const cleanClone = (root) => loopRoot(clone(root), (option, pattern, rootCloned) => {
  delete rootCloned[pattern]._priority;
  delete rootCloned[pattern]._pattern;
  delete rootCloned[pattern]._dir;
});

const zRoot = (t, file, expected) => getRoot(file).tap(
  (root) => {
    same(t, cleanClone(root), cleanClone(expected));
  }
);

const zConfig = (t, file, expected) => getConfig(file).tap(
  (config) => {
    same(t, config, expected);
  }
);

test((t) => Promise.all([
  zRoot(t, '/crlf/near.md', {
    'root': true,
    '*': {
      'end_of_line': 'crlf'
    }
  }),
  zRoot(t, '/crlf/very/very/deep.md', {
    'root': true,
    '*': {
      'end_of_line': 'crlf'
    }
  }),
  zRoot(t, '/fall/back/to/the/deepest', {
    '*.py': {
      'indent_style': 'tab'
    }
  }),
  zRoot(t, '/crlf/indent-tab/some.py', {
    'root': true,
    '*': {
      'end_of_line': 'crlf'
    },
    '*.py': {
      'indent_style': 'tab'
    }
  })
]).then(() => Promise.all([
  zConfig(t, '/crlf/near.md', {
    'end_of_line': 'crlf'
  }),
  zConfig(t, '/fall/back/to/the/deepest', {}),
  zConfig(t, '/crlf/indent-tab/some.py', {
    'end_of_line': 'crlf',
    'indent_style': 'tab'
  })
])).then(() => {
  delete samples['/.editorconfig'];
  delete getRoot.dirCache['/'];
  return zRoot(t, '/file/with/no/config', defaults);
}));
