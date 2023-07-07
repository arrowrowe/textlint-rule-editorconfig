// Based on [ini](https://github.com/npm/ini) by Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/).
// Modified, cause here we need to know each section's priority.

import process from 'node:process';

export {decode as parse, decode, encode as stringify, encode, safe, unsafe};

const eol = process.platform === 'win32' ? '\r\n' : '\n';

function encode(object, opt) {
  const children = [];
  let out = '';

  if (typeof opt === 'string') {
    opt = {
      section: opt,
      whitespace: false,
    };
  } else {
    opt = opt || {};
    opt.whitespace = opt.whitespace === true;
  }

  const separator = opt.whitespace ? ' = ' : '=';

  for (const k of Object.keys(object)) {
    const value = object[k];
    if (value && Array.isArray(value)) {
      for (const item of value) {
        out += safe(k + '[]') + separator + safe(item) + '\n';
      }
    } else if (value && typeof value === 'object') {
      children.push(k);
    } else {
      out += safe(k) + separator + safe(value) + eol;
    }
  }

  if (opt.section && out.length > 0) {
    out = '[' + safe(opt.section) + ']' + eol + out;
  }

  for (const k of children) {
    const nk = dotSplit(k).join('\\.');
    const section = (opt.section ? opt.section + '.' : '') + nk;
    const child = encode(object[k], {
      section,
      whitespace: opt.whitespace,
    });
    if (out.length > 0 && child.length > 0) {
      out += eol;
    }

    out += child;
  }

  return out;
}

function dotSplit(string_) {
  return string_.replace(/\1/g, '\u0002LITERAL\\1LITERAL\u0002')
    .replace(/\\\./g, '\u0001')
    .split(/\./).map((part) => part.replace(/\1/g, '\\.')
      .replace(/\2LITERAL\\1LITERAL\2/g, '\u0001'));
}

function decode(string_) {
  const out = Object.create(null);
  let p = out;
  let section = null;
  //            Section     |key      = value
  const re = /^\[([^\]]*)]$|^([^=]+)(=(.*))?$/i;
  const lines = string_.split(/[\r\n]+/g);

  for (const [lineIndex, line] of lines.entries()) {
    if (!line || /^\s*[;#]/.test(line)) {
      continue;
    }

    const match = line.match(re);
    if (!match) {
      continue;
    }

    if (match[1] !== undefined) {
      section = unsafe(match[1]);
      p = out[section] || {};
      out[section] = p;
      p._priority = lineIndex;
      continue;
    }

    let key = unsafe(match[2]);
    let value = match[3] ? unsafe((match[4] || '')) : true;

    switch (value) {
      case 'true': {
        value = true;

        break;
      }

      case 'false': {
        value = false;

        break;
      }

      case 'null': {
        value = null;

        break;
      }
    // No default
    }

    // Convert keys with '[]' suffix to an array
    if (key.length > 2 && key.slice(-2) === '[]') {
      key = key.slice(0, Math.max(0, key.length - 2));
      if (!p[key]) {
        p[key] = [];
      } else if (!Array.isArray(p[key])) {
        p[key] = [p[key]];
      }
    }

    // Safeguard against resetting a previously defined
    // array by accidentally forgetting the brackets
    if (Array.isArray(p[key])) {
      p[key].push(value);
    } else {
      p[key] = value;
    }
  }

  /*
  // {a:{y:1},"a.b":{x:2}} --> {a:{y:1,b:{x:2}}}
  // use a filter to return the keys that have to be deleted.
  Object.keys(out).filter(function (k) {
    if (!out[k] ||
      typeof out[k] !== 'object' ||
      Array.isArray(out[k])) {
      return false;
    }
    // see if the parent section is also an object.
    // if so, add it to that, and mark this one for deletion
    const parts = dotSplit(k);
    let p = out;
    const l = parts.pop();
    const nl = l.replace(/\\\./g, '.');
    parts.forEach(function (part) {
      if (!p[part] || typeof p[part] !== 'object') {
        p[part] = {};
      }
      p = p[part];
    });
    if (p === out && nl === l) {
      return false;
    }
    p[nl] = out[k];
    return true;
  }).forEach(function (del) {
    delete out[del];
  });
  */

  return out;
}

function isQuoted(value) {
  return (value.charAt(0) === '"' && value.slice(-1) === '"')
    || (value.charAt(0) === '\'' && value.slice(-1) === '\'');
}

function safe(value) {
  return (typeof value !== 'string'
    || /[=\r\n]/.test(value)
    || /^\[/.test(value)
    || (value.length > 1
     && isQuoted(value))
    || value !== value.trim())
    ? JSON.stringify(value)
    : value.replace(/;/g, '\\;').replace(/#/g, '\\#');
}

function unsafe(value) {
  value = (value || '').trim();
  if (isQuoted(value)) {
    // Remove the single quotes before calling JSON.parse
    if (value.charAt(0) === '\'') {
      value = value.slice(1, 1 + value.length - 2);
    }

    try {
      value = JSON.parse(value);
    } catch {}
  } else {
    // Walk the val to find the first not-escaped ; character
    let esc = false;
    let unesc = '';
    for (let i = 0, l = value.length; i < l; i++) {
      const c = value.charAt(i);
      if (esc) {
        unesc += '\\;#'.includes(c) ? c : '\\' + c;
        esc = false;
      } else if (';#'.includes(c)) {
        break;
      } else if (c === '\\') {
        esc = true;
      } else {
        unesc += c;
      }
    }

    if (esc) {
      unesc += '\\';
    }

    return unesc;
  }

  return value;
}
