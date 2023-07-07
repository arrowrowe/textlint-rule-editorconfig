import fs from 'node:fs';

const read = (file) => fs.readFileSync(
  new URL(`samples/${file}.ini`, import.meta.url), 'utf8',
);

const samples = {
  '/.editorconfig': read('py-indent-tab'),
  '/crlf/.editorconfig': read('root-crlf'),
  '/crlf/indent-tab/.editorconfig': read('py-indent-tab'),
};

export default samples;
