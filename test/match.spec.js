import test from 'ava';
import match from '../match.js';

test('Match basenames', (t) => {
  const any = match('*');
  t.true(any('a-file-without-ext'));
  t.true(any('a-file-with-ext.md'));
  t.true(any('a/file/with/relative/path'));
  t.true(any('/a/file/with/absolute/path'));
  const isMd = match('*.{md,markdown}');
  t.true(isMd('a-file-with-ext.md'));
  t.true(isMd('a-file-with-ext.markdown'));
  t.true(isMd('a/file/with/relative/path.md'));
  t.true(isMd('/a/file/with/absolute/path.markdown'));
  t.false(isMd('a-file-without-ext'));
  t.false(isMd('a-file-with-another-ext.js'));
  t.false(isMd('a/file/with/relative/path/and/another/ext.js'));
  t.false(isMd('/a/file/with/absolute/path/and/another/ext.scss'));
});

test('Match full path', (t) => {
  const isLibFirstJS = match('lib/*.js');
  t.true(isLibFirstJS('lib/with-ext.js'));
  t.false(isLibFirstJS('lib/no-ext'));
  t.false(isLibFirstJS('lib/too/deep/any.js'));
  t.false(isLibFirstJS('/lib/in/absolute/path.js'));
});

test('Match `**` with any depth', (t) => {
  const isTestSpec = match('test/**/*.spec.js');
  t.true(isTestSpec('test/core.spec.js'));
  t.true(isTestSpec('test/very/very/very/deep/test.spec.js'));
  t.false(isTestSpec('/test/that/is/absolute/path.spec.js'));
});
