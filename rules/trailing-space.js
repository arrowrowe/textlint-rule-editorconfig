'use strict';

module.exports = (context, node, text, config) => {
  if (!config.trim_trailing_whitespace) {
    return;
  }
  let pattern = /[ \t]+$/mg;
  let textWarn = 'Found trailing spaces at line\'s ending';
  let match;
  while (match = pattern.exec(text)) {
    const index = match.index;
    context.report(node, new context.RuleError(textWarn, {
      index,
      fix: context.fixer.replaceTextRange([index, index + match[0].length], '')
    }));
  }
};
