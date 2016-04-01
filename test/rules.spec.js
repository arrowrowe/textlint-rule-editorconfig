// Write this custom tester instead of textlint-testser,
// cause we need custom configurations...

import test from 'ava';

import rules from '../rules';
import sortKeys from 'sort-keys';

const elementsSame = (t, a, b) => {
  a.sort();
  b.sort();
  t.same(a.map(sortKeys), b.map(sortKeys));
};

const z = (t, config, text, expected) => {
  const errors = [];
  const args = {
    text,
    context: {
      RuleError: (textWarn, detail) => detail,
      report: (node, error) => errors.push(error),
      fixer: {
        replaceTextRange: (range, fix) => ({range, fix})
      }
    }
  };
  rules.forEach((rule) => rule(config, args));
  if (expected) {
    elementsSame(t, errors, expected);
  } else {
    t.is(errors.length, 0);
  }
};

test('Indent', (t) => {
  z(t, {
    'indent_style': 'space',
    'indent_size': 2
  }, '\t1\n\t\t2\n  \t \t5\n    4', [
    {index: 0, fix: {range: [0, 1], fix: '  '}},
    {index: 3, fix: {range: [3, 5], fix: '    '}},
    {index: 7, fix: {range: [7, 12], fix: '       '}}
  ]);
  z(t, {
    'indent_style': 'tab'
  }, '\t1\n\t\t2\n  \t \t5\n    4', [
    {index: 7},
    {index: 14}
  ]);
});

test('Trailing space', (t) => {
  z(t, {
    'trim_trailing_whitespace': true
  }, '1  2\n3   \n   4 5\n6  ', [
    {index: 6, fix: {range: [6, 9], fix: ''}},
    {index: 18, fix: {range: [18, 20], fix: ''}}
  ]);
});

test('Final new line', (t) => {
  z(t, {
    'insert_final_newline': true
  }, '', [
    {index: 0, fix: {range: [0, 0], fix: '\n'}}
  ]);
  z(t, {
    'insert_final_newline': true
  }, '123', [
    {index: 3, fix: {range: [3, 3], fix: '\n'}}
  ]);
  z(t, {
    'insert_final_newline': true
  }, '456\n123', [
    {index: 7, fix: {range: [7, 7], fix: '\n'}}
  ]);
  z(t, {
    'insert_final_newline': true
  }, '\n');
  z(t, {
    'insert_final_newline': true
  }, '123\n');
});

test('EOL', (t) => {
  z(t, {
    'end_of_line': 'cr'
  }, '\n1  \r2\r\n3 \r  \n   4 5\r\n6  ', [
    {index: 0, fix: {range: [0, 1], fix: '\r'}},
    {index: 6, fix: {range: [6, 8], fix: '\r'}},
    {index: 13, fix: {range: [13, 14], fix: '\r'}},
    {index: 20, fix: {range: [20, 22], fix: '\r'}}
  ]);
  z(t, {
    'end_of_line': 'lf'
  }, '\r1  \n2\r\n3 \n  \r   4 5\r\n6  ', [
    {index: 0, fix: {range: [0, 1], fix: '\n'}},
    {index: 6, fix: {range: [6, 8], fix: '\n'}},
    {index: 13, fix: {range: [13, 14], fix: '\n'}},
    {index: 20, fix: {range: [20, 22], fix: '\n'}}
  ]);
  z(t, {
    'end_of_line': 'crlf'
  }, '\n1  \r2\r\n3 \r  \n   4 5\r\n6  ', [
    {index: 0, fix: {range: [0, 1], fix: '\r\n'}},
    {index: 4, fix: {range: [4, 5], fix: '\r\n'}},
    {index: 10, fix: {range: [10, 11], fix: '\r\n'}},
    {index: 13, fix: {range: [13, 14], fix: '\r\n'}}
  ]);
});
