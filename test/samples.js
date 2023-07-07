import fs from 'node:fs';

const read = (file) => fs.readFileSync('./samples/' + file + '.ini', 'utf8');

const samples = {
  '/.editorconfig': read('py-indent-tab'),
  '/crlf/.editorconfig': read('root-crlf'),
  '/crlf/indent-tab/.editorconfig': read('py-indent-tab'),
};

export default samples;
