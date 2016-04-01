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

const zOption = (t, option, config, text, expected) => {
  const errors = [];
  const args = {
    text,
    option,
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

const z = (t, config, text, expected) => {
  zOption(t, Object.create(null), config, text, expected);
};

test('Ignore wrong configurations', (t) => {
  z(t, {
    'indent_style': 'some-unkown-indent-style',
    'end_of_line': 'some-unkown-eol'
  }, 'Some text.');
});

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

test('Charset', (t) => {
  z(t, {
    'charset': 'utf-8'
  }, '\xc3\xa0\xc3\xad\xc3\xa0\xc3\xa7\xc3\xa3');
  z(t, {
    'charset': 'big5'
  }, '\xc3\xa0\xc3\xad\xc3\xa0\xc3\xa7\xc3\xa3', [
    {index: 0}
  ]);
  z(t, {
    'charset': 'big5'
  }, '\xa6\xb8\xb1\x60\xa5\xce\xb0\xea\xa6\x72\xbc\xd0\xb7\xc7\xa6\x72\xc5\xe9\xaa\xed');
  z(t, {
    'charset': 'utf-8'
  }, '\xa6\xb8\xb1\x60\xa5\xce\xb0\xea\xa6\x72\xbc\xd0\xb7\xc7\xa6\x72\xc5\xe9\xaa\xed', [
    {index: 0}
  ]);
});
