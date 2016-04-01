const scan = require('../scan');

module.exports = (config, args) => {
  if (typeof config.indent_style !== 'string') {
    return;
  }
  const ruleValue = config.indent_style.toLowerCase();
  const rule = Object.create(null);
  if (ruleValue === 'tab') {
    rule.textWarn = 'Found space indent!';
    rule.report = (match) => match[0].indexOf(' ') === -1 ? null : {};
  } else if (ruleValue === 'space') {
    const tabReplacer = ' '.repeat(Math.max(Number(config.indent_size), 1));
    rule.textWarn = 'Found tab indent!';
    rule.report = (match) => match[0].indexOf('\t') === -1 ? null : {
      fix: match[0].replace(/\t/g, tabReplacer)
    };
  } else {
    return;
  }
  rule.pattern = /^[ \t]+/mg;
  scan(rule, args);
};
