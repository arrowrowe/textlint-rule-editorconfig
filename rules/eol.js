import scan from '../scan.js';

const EOL_NAMES = ['cr', 'lf', 'crlf'];
const INDEX_CR = 0;
const INDEX_LF = 1;

const rule = (config, args) => {
  if (typeof config.end_of_line !== 'string') {
    return;
  }

  const EOL_TYPE = EOL_NAMES.indexOf(config.end_of_line.toLowerCase());
  if (EOL_TYPE === -1) {
    return;
  }

  const rule = {
    textWarn: 'Found wrong EOL',
  };
  if (EOL_TYPE === INDEX_CR) {
    rule.pattern = /\r?\n/g;
    rule.report = () => ({fix: '\r'});
  } else if (EOL_TYPE === INDEX_LF) {
    rule.pattern = /\r\n?/g;
    rule.report = () => ({fix: '\n'});
  } else {
    rule.pattern = /(\r(?!\n))|([^\r]\n)|(^\n)/g;
    rule.report = (match) => match[2] ? {
      index: match.index + 1,
      length: 1,
      fix: '\r\n',
    } : {
      fix: '\r\n',
    };
  }

  scan(rule, args);
};

export default rule;
