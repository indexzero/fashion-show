'use strict';

var minimist = require('minimist'),
    debug = require('diagnostics')('fashion-show:defaultify');

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

  debug('defaultify.defaults', defaults);
  var options = {
    commands: toArray(argv.command || defaults.commands || ['jscs', 'eslint']),
    targets:  toArray((argv._.length && argv._) || defaults.targets  || ['lib']),
    rc:       argv.rc       || defaults.rc,
    fix:      argv.fix      || defaults.fix,
    reporter: argv.reporter || defaults.reporter,
    global:   argv.global   || defaults.global,
    exts: ['.js']
      .concat(argv.ext      || [])
      .concat(defaults.exts || []),
  };

  debug('defaultify.options', options);
  return options;
};

/**
 * Returns an Array-ified version of the obj.
 */
function toArray(obj) {
  return Array.isArray(obj) ? obj : [obj];
};
