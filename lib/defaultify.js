'use strict';

var minimist = require('minimist');

/**
 * Returns the fully options mixing in the specified `defaults`
 * along with any `argv` (whether explicit or implicit).
 */
module.exports = function defaultify(defaults) {
  var argv = minimist(defaults.argv || process.argv.slice(2), {
    alias: {
      commands: 'c',
      rc: 'r',
      tests: 't',
      fix: 'f',
      ext: 'e',
      reporter: 'r',
      global: 'g'
    }
  });

  return {
    commands: toArray(argv.command || defaults.commands || ['jscs', 'eslint']),
    targets:  toArray(argv._       || defaults.targets  || ['lib']),
    rc:       argv.rc       || defaults.rc,
    tests:    argv.tests    || defaults.tests,
    fix:      argv.fix      || defaults.fix,
    reporter: argv.reporter || defaults.reporter,
    global:   argv.global   || defaults.global,
    exts: ['.js']
      .concat(argv.ext      || [])
      .concat(defaults.exts || []),
  };
};

/**
 * Returns an Array-ified version of the obj.
 */
function toArray(obj) {
  return Array.isArray(obj) ? obj : [obj];
};
