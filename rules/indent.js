'use strict';

module.exports = (context, node, text, config) => {
  const ruleValue = config.indent_style;
  if (!ruleValue) {
    return;
  }
  let pattern;
  let textWarn;
  let fix;
  const indentSize = Math.max(Number(config.indent_size), 1);
  if (ruleValue === 'tab') {
    pattern = /^ +/mg;
    textWarn = 'Found space at line\'s beginning';
    fix = (length) => '\t'.repeat(Math.ceil(length / indentSize));
  } else if (ruleValue === 'space') {
    pattern = /^\t+/mg;
    textWarn = 'Found tab at line\'s beginning';
    fix = (length) => ' '.repeat(length * indentSize);
  } else {
    // console.warn('Invalid: "indent_style = %s"', ruleValue);
    return;
  }
  let match;
  while (match = pattern.exec(text)) {
    const index = match.index;
    const length = match[0].length;
    context.report(node, new context.RuleError(textWarn, {
      index,
      fix: context.fixer.replaceTextRange([index, index + length], fix(length))
    }));
  }
};
