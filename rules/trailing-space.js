const scan = require('../scan');

module.exports = (config, args) => {
  if (config.trim_trailing_whitespace) {
    scan({
      pattern: /[ \t]+$/gm,
      textWarn: 'Found trailing spaces at line\'s ending',
      report: () => ({fix: ''}),
    }, args);
  }
};
