import indent from './rules/indent.js';
import trailingSpace from './rules/trailing-space.js';
import finalNewline from './rules/final-newline.js';
import eol from './rules/eol.js';
import charset from './rules/charset.js';

const rules = [
  indent,
  trailingSpace,
  finalNewline,
  eol,
  charset,
];

export default rules;
