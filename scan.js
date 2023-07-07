'use strict';

const utilReport = require('./util/report');

const scanOnce = (rule, args, match) => {
  const report = rule.report(match);
  if (report === null) {
    return;
  }

  report.index = 'index' in report ? report.index : match.index;
  report.length = 'length' in report ? report.length : match[0].length;
  utilReport(args, report, rule.textWarn);
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
