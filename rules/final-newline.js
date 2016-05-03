const scan = require('../scan');

const eofTypeToChar = (eolType) => {
  switch (eolType.toString().toLowerCase()) {
    case 'cr':
      return '\r';
    case 'lf':
      return '\n';
    case 'crlf':
      return '\r\n';
    default:
      return null;
  }
};

module.exports = (config, args) => {
  if (config.insert_final_newline) {
    scan({
      pattern: /([\r\n].*|^.*)$/,
      textWarn: 'No final new line',
      report: (match) => {
        const raw = match[0];
        return raw === '' ?
          {fix: '\n'} :
          raw.replace(/[\r\n]/g, '') ?
            {
              index: match.index + raw.length,
              length: 0,
              fix: eofTypeToChar(config.end_of_line) || '\n'
            } :
            null;
      }
    }, args);
  }
};
