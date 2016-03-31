const preRoot = require('./pre-root');

module.exports = preRoot({
  root: true,
  '*': {
    _priority: 0,
    end_of_line: 'lf',
    insert_final_newline: true,
    charset: 'utf-8'
  }
});
