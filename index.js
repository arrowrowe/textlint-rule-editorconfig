import getConfig from './editorconfig/get-config.js';
import rules from './rules.js';

function reporter(context, option) {
  const exports = {};
  exports[context.Syntax.Document] = (node) => getConfig(context.getFilePath()).then((config) => {
    const args = {
      context,
      node,
      option,
      text: context.getSource(node),
    };
    for (const rule of rules) {
      rule(config, args);
    }
  });
  return exports;
}

const reporters = {
  linter: reporter,
  fixer: reporter,
};

export default reporters;
