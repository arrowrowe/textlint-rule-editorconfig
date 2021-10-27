# textlint-rule-editorconfig

[![textlint rule][textlint-badge]][Textlint]
[![Gitter][gitter-badge]][gitter-url]
[![Build Status][build-badge]][build-url]
[![Coverage][coverage-badge]][coverage-url]
[![NPM Version][npm-badge]][npm-url]

[textlint-badge]: https://img.shields.io/badge/textlint-fixable-green.svg?style=social
[gitter-badge]: https://badges.gitter.im/arrowrowe/textlint-rule-editorconfig.svg
[gitter-url]: https://gitter.im/arrowrowe/textlint-rule-editorconfig?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge
[build-url]: https://travis-ci.org/arrowrowe/textlint-rule-editorconfig
[build-badge]: https://travis-ci.org/arrowrowe/textlint-rule-editorconfig.svg
[coverage-url]: https://codecov.io/github/arrowrowe/textlint-rule-editorconfig?branch=master
[coverage-badge]: https://codecov.io/github/arrowrowe/textlint-rule-editorconfig/coverage.svg?branch=master
[npm-badge]: https://img.shields.io/npm/v/textlint-rule-editorconfig.svg
[npm-url]: https://www.npmjs.com/package/textlint-rule-editorconfig

[EditorConfig]: http://editorconfig.org/
[Textlint]: https://textlint.github.io/
[Textlint-readme]: https://github.com/textlint/textlint#readme

Let [EditorConfig][EditorConfig] and [Textlint][Textlint] work together.

## Usage

See also [Textlint's readme][Textlint-readme].

## TL;DR

`.textlintrc`

```javascript
{
  "rules": {
    "editorconfig": true
  }
}
```

`package.json`

```javascript
{
  // ...
  "scripts": {
    "textlint": "textlint",
    "textlint:fix": "textlint --fix"
  }
  // ...
}
```

Command line:

```shell
npm i -S textlint
npm i -S textlint-rule-editorconfig
npm run textlint
npm run textlint:fix
```

## Strategy

- .editorconfig
  - Merge all .editorconfig files along the way, starting from nearest, until `root = true` fonud. If nothing found, provides a default configuration.
  - Priority: the nearer the higher between files, the later the higher in one file.
- Glob (see [match.js](match.js) for details) based on [minimatch](https://www.npmjs.com/package/minimatch), but retrieve a file's [basename](https://nodejs.org/api/path.html#path_path_basename_p_ext) first, if no `/` found in the pattern.
- Rules
  - `indent_style`: check all lines beginning with space or tab.
    - If `indent_style = space`, able to fix replacing each beginning tab to 2 spaces (or other, configurable via `indent_size`).
    - If `indent_style = tab`, unable to fix. Only warnings generated.
  - `trim_trailing_whitespace`: as you may expect. Fixable.
  - `insert_final_newline`: as you may expect. Fixable.
  - `end_of_line`: as you may expect. Fixable.
  - `charset`: based on [jschardet](https://github.com/aadsm/jschardet). Not fixable, as it is kind of dangerous.

## Contribute

Feel free to open issues or send PRs.
