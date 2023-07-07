import path from 'node:path';
import {Minimatch} from 'minimatch';

const isBasenamePattern = (string_) => !string_.includes('/');

const rule = (pattern) => {
  const mm = new Minimatch(pattern);
  return isBasenamePattern(pattern)
    ? (file) => mm.match(path.basename(file))
    : mm.match.bind(mm);
};

export default rule;
