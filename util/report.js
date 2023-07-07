const report = (args, report, textWarn) => {
  const detail = {
    index: report.index,
  };
  if (typeof report.fix === 'string') {
    detail.fix = args.context.fixer.replaceTextRange(
      [detail.index, detail.index + report.length],
      report.fix,
    );
  }

  args.context.report(args.node, new args.context.RuleError(textWarn, detail));
};

export default report;
