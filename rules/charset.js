const jschardet = require('jschardet');

module.exports = (config, args) => {
  if (typeof config.charset !== 'string') {
    return;
  }
  const expected = config.charset.toLowerCase();
  const real = jschardet.detect(args.text);
  real.encoding = real.encoding.toLowerCase();
  if (real.encoding !== expected) {
    args.context.report(
      args.node,
      new args.context.RuleError(
        'Found ' + real.confidence.toString() + ' possible wrong charset "' +
          real.encoding + '", expected "' + expected + '".',
        {index: 0}
      )
    );
  }
};
