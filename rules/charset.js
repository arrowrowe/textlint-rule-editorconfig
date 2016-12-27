const jschardet = require('jschardet');

const utilReport = require('../util/report');

module.exports = (config, args) => {
  if (typeof config.charset !== 'string') {
    return;
  }
  if (args.option.charset === false) {
    return;
  }
  const expected = config.charset.toLowerCase();
  const real = jschardet.detect(args.text);
  real.encoding = real.encoding.toLowerCase();
  if (real.encoding !== expected) {
    utilReport(
      args,
      {index: 0},
      'Found ' + real.confidence.toString() + ' possible wrong charset "' +
        real.encoding + '", expected "' + expected + '".'
    );
  }
};
