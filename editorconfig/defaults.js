import preRoot from './pre-root.js';

export default preRoot({
  root: true,
  '*': {
    _priority: 0,
    end_of_line: 'lf',
    insert_final_newline: true,
    charset: 'utf-8', // eslint-disable-line unicorn/text-encoding-identifier-case
  },
});
