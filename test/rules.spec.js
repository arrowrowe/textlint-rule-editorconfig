// Write this custom tester instead of textlint-testser,
// cause we need custom configurations...

import test from 'ava';
import sortKeys from 'sort-keys';
import rules from '../rules.js';

const elementsSame = (t, a, b) => {
  a.sort();
  b.sort();
  t.same(a.map((element) => sortKeys(element)), b.map((element) => sortKeys(element)));
};

const zOption = (t, option, config, text, expected) => { // eslint-disable-line max-params
  const errors = [];
  const args = {
    text,
    option,
    context: {
      RuleError: (textWarn, detail) => detail,
      report: (node, error) => errors.push(error),
      fixer: {
        replaceTextRange: (range, fix) => ({range, fix}),
      },
    },
  };
  for (const rule of rules) {
    rule(config, args);
  }

  if (expected) {
    elementsSame(t, errors, expected);
  } else {
    t.is(errors.length, 0);
  }
};

const z = (t, config, text, expected) => {
  zOption(t, Object.create(null), config, text, expected);
};

test('Ignore wrong configurations', (t) => {
  z(t, {
    'indent_style': 'some-unkown-indent-style',
    'end_of_line': 'some-unkown-eol',
  }, 'Some text.');
});

test('Indent', (t) => {
  z(t, {
    'indent_style': 'SpAcE', // Automatically lowercase this
    'indent_size': 2,
  }, '\t1\n\t\t2\n  \t \t5\n    4', [
    {index: 0, fix: {range: [0, 1], fix: '  '}},
    {index: 3, fix: {range: [3, 5], fix: '    '}},
    {index: 7, fix: {range: [7, 12], fix: '       '}},
  ]);
  z(t, {
    'indent_style': 'tab',
  }, '\t1\n\t\t2\n  \t \t5\n    4', [
    {index: 7},
    {index: 14},
  ]);
});

test('Trailing space', (t) => {
  z(t, {
    'trim_trailing_whitespace': true,
  }, '1  2\n3   \n   4 5\n6  ', [
    {index: 6, fix: {range: [6, 9], fix: ''}},
    {index: 18, fix: {range: [18, 20], fix: ''}},
  ]);
});

test('Final new line', (t) => {
  z(t, {
    'insert_final_newline': true,
  }, '', [
    {index: 0, fix: {range: [0, 0], fix: '\n'}},
  ]);
  z(t, {
    'end_of_line': null,
    'insert_final_newline': true,
  }, '', [
    {index: 0, fix: {range: [0, 0], fix: '\n'}},
  ]);
  z(t, {
    'end_of_line': 'some-strange-things',
    'insert_final_newline': true,
  }, '', [
    {index: 0, fix: {range: [0, 0], fix: '\n'}},
  ]);
  z(t, {
    'end_of_line': 'lf',
    'insert_final_newline': true,
  }, '123', [
    {index: 3, fix: {range: [3, 3], fix: '\n'}},
  ]);
  z(t, {
    'end_of_line': 'cr',
    'insert_final_newline': true,
  }, '456\n123', [
    {index: 7, fix: {range: [7, 7], fix: '\r'}},
    {index: 3, fix: {range: [3, 4], fix: '\r'}},
  ]);
  z(t, {
    'end_of_line': 'crlf',
    'insert_final_newline': true,
  }, '456\n123', [
    {index: 7, fix: {range: [7, 7], fix: '\r\n'}},
    {index: 3, fix: {range: [3, 4], fix: '\r\n'}},
  ]);
  z(t, {
    'insert_final_newline': true,
  }, '\n');
  z(t, {
    'insert_final_newline': true,
  }, '123\n');
});

test('EOL', (t) => {
  z(t, {
    'end_of_line': 'cr',
  }, '\n1  \r2\r\n3 \r  \n   4 5\r\n6  ', [
    {index: 0, fix: {range: [0, 1], fix: '\r'}},
    {index: 6, fix: {range: [6, 8], fix: '\r'}},
    {index: 13, fix: {range: [13, 14], fix: '\r'}},
    {index: 20, fix: {range: [20, 22], fix: '\r'}},
  ]);
  z(t, {
    'end_of_line': 'lf',
  }, '\r1  \n2\r\n3 \n  \r   4 5\r\n6  ', [
    {index: 0, fix: {range: [0, 1], fix: '\n'}},
    {index: 6, fix: {range: [6, 8], fix: '\n'}},
    {index: 13, fix: {range: [13, 14], fix: '\n'}},
    {index: 20, fix: {range: [20, 22], fix: '\n'}},
  ]);
  z(t, {
    'end_of_line': 'crlf',
  }, '\n1  \r2\r\n3 \r  \n   4 5\r\n6  ', [
    {index: 0, fix: {range: [0, 1], fix: '\r\n'}},
    {index: 4, fix: {range: [4, 5], fix: '\r\n'}},
    {index: 10, fix: {range: [10, 11], fix: '\r\n'}},
    {index: 13, fix: {range: [13, 14], fix: '\r\n'}},
  ]);
});

test('Charset', (t) => {
  z(t, {
    'charset': 'utf8',
  }, '\u00C3\u00A0\u00C3\u00AD\u00C3\u00A0\u00C3\u00A7\u00C3\u00A3');
  z(t, {
    'charset': 'big5',
  }, '\u00C3\u00A0\u00C3\u00AD\u00C3\u00A0\u00C3\u00A7\u00C3\u00A3', [
    {index: 0},
  ]);
  z(t, {
    'charset': 'big5',
  }, '\u00A6\u00B8\u00B1\u0060\u00A5\u00CE\u00B0\u00EA\u00A6\u0072\u00BC\u00D0\u00B7\u00C7\u00A6\u0072\u00C5\u00E9\u00AA\u00ED');
  z(t, {
    'charset': 'utf8',
  }, '\u00A6\u00B8\u00B1\u0060\u00A5\u00CE\u00B0\u00EA\u00A6\u0072\u00BC\u00D0\u00B7\u00C7\u00A6\u0072\u00C5\u00E9\u00AA\u00ED', [
    {index: 0},
  ]);
  zOption(t, {
    'charset': false,
  }, {
    'charset': 'utf8',
  }, '\u00A6\u00B8\u00B1\u0060\u00A5\u00CE\u00B0\u00EA\u00A6\u0072\u00BC\u00D0\u00B7\u00C7\u00A6\u0072\u00C5\u00E9\u00AA\u00ED');
});
