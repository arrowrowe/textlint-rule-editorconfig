'use strict';

const getConfig = require('./editorconfig/get-config');
const rules = require('./rules');

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

module.exports = {
  linter: reporter,
  fixer: reporter,
};
