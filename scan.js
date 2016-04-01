'use strict';

const scanOnce = (rule, args, match) => {
  const report = rule.report(match);
  if (report === null) {
    return;
  }
  const detail = {
    index: 'index' in report ? report.index : match.index
  };
  if ('fix' in report) {
    detail.fix = args.context.fixer.replaceTextRange(
      [detail.index, detail.index + ('length' in report ? report.length : match[0].length)],
      report.fix
    );
  }
  args.context.report(args.node, new args.context.RuleError(rule.textWarn, detail));
};

module.exports = (rule, args) => {
  if (rule.pattern.global) {
    let match;
    while (match = rule.pattern.exec(args.text)) {
      scanOnce(rule, args, match);
    }
  } else {
    scanOnce(rule, args, rule.pattern.exec(args.text));
  }
};
