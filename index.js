'use strict';

const getConfig = require('./editorconfig/get-config');
const rules = require('./rules');

function reporter(context) {
  const exports = {};
  exports[context.Syntax.Document] = (node) => getConfig(context.getFilePath()).then((config) => {
    const text = context.getSource(node);
    rules.forEach((rule) => rule(context, node, text, config));
  });
  return exports;
}

module.exports = {
  linter: reporter,
  fixer: reporter
};
