const scan = require('../scan');

const eofTypeToChar = (eolType) => {
  if (typeof eolType !== 'string') {
    return null;
  }
  switch (eolType.toLowerCase()) {
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
    const fix = eofTypeToChar(config.end_of_line) || '\n';
    scan({
      pattern: /([\r\n].*|^.*)$/,
      textWarn: 'No final new line',
      report: (match) => {
        const raw = match[0];
        return raw === '' ?
          {fix: fix} :
          raw.replace(/[\r\n]/g, '') ?
            {
              index: match.index + raw.length,
              length: 0,
              fix: fix
            } :
            null;
      }
    }, args);
  }
};
