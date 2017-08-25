'use strict';

var path = require('path'),
    minimist = require('minimist'),
    debug = require('diagnostics')('fashion-show:defaultify');

/**
 * Returns the fully options mixing in the specified `defaults`
 * along with any `argv` (whether explicit or implicit).
 */
module.exports = function defaultify(defaults) {
  defaults = defaults || {};
  var argv = minimist(defaults.argv || process.argv.slice(2), {
    alias: {
      commands: 'c',
      rc: 'r',
      fix: 'f',
      ext: 'e',
      path: 'p',
      reporter: 'r',
      global: 'g'
    }
  });

  debug('defaultify.defaults', defaults);

  if (argv.command && !Array.isArray(argv.command)) {
    argv.command = [argv.command];
  }

  if (argv.ext && !Array.isArray(argv.ext)) {
    argv.ext = [argv.ext];
  }

  if (argv._ && !argv._.length) {
    argv._ = null;
  }

  var options = {
    commands: toArray(argv.command || defaults.commands || ['jscs', 'eslint']),
    targets:  toArray(argv._       || defaults.targets  || ['lib']),
    rc:       argv.rc       || defaults.rc  || defaults.configDir,
    cwd:      argv.cwd      || defaults.cwd || process.cwd(),
    fix:      argv.fix      || defaults.fix,
    env:      defaults.env  || {},
    binPath:  argv.path     || defaults.binPath,
    reporter: argv.reporter || defaults.reporter,
    format:   argv.format   || defaults.format,
    global:   argv.global   || defaults.global,
    exts:     toArray(argv.ext || defaults.exts || [])
  };

  if (!options.binPath) {
    options.binPath = path.join(
      path.dirname(options.rc || ''),
      'node_modules',
      '.bin'
    );
  }

  debug('defaultify.options', options);
  return options;
};

/**
 * Returns an Array-ified version of the obj.
 */
function toArray(obj) {
  return Array.isArray(obj) ? obj : [obj];
}
