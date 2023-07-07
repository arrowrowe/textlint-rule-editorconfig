const fs = require('node:fs');

const read = (file) => fs.readFileSync('./samples/' + file + '.ini', 'utf8');

module.exports = {
  '/.editorconfig': read('py-indent-tab'),
  '/crlf/.editorconfig': read('root-crlf'),
  '/crlf/indent-tab/.editorconfig': read('py-indent-tab'),
};
