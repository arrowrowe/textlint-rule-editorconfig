'use strict';

const getConfig = require('./editorconfig/get-config');
const rules = require('./rules');

function reporter(context) {
  const exports = {};
  exports[context.Syntax.Document] = (node) => getConfig(context.getFilePath()).then((config) => {
    const args = {context, node, text: context.getSource(node)};
    rules.forEach((rule) => rule(config, args));
  });
  return exports;
}

module.exports = {
  linter: reporter,
  fixer: reporter
};
