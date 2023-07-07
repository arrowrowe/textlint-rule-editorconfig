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

  // eslint-disable-next-line new-cap
  args.context.report(args.node, args.context.RuleError(textWarn, detail));
};

export default report;
