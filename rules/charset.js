import jschardet from 'jschardet';
import utilReport from '../util/report.js';

const rule = (config, args) => {
  if (typeof config.charset !== 'string') {
    return;
  }

  if (args.option.charset === false) {
    return;
  }

  const expected = config.charset.toLowerCase();
  const real = jschardet.detect(args.text);
  real.encoding = real.encoding.toLowerCase();

  if (real.encoding === expected) {
    return;
  }

  // HACK: ASCII is a subset of UTF-8, so we don't need to report it.
  //       See https://github.com/CharsetDetector/UTF-unknown/issues/161
  // eslint-disable-next-line unicorn/text-encoding-identifier-case
  if (real.encoding === 'ascii' && expected === 'utf-8') {
    return;
  }

  utilReport(
    args,
    {index: 0},
    'Found ' + real.confidence.toString() + ' possible wrong charset "'
      + real.encoding + '", expected "' + expected + '".',
  );
};

export default rule;
