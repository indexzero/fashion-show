'use strict';

var path = require('path'),
    debug = require('diagnostics')('fashion-show:argify');

/**
 * function argify(command, opts)
 * Returns a fully formed arguments array for the
 * specified options.
 */
var argify = module.exports = function (command, opts) {
  if (!opts || !opts.targets || !opts.targets.length) {
    throw new Error('opts and opts.targets are required');
  }
  var basename = path.basename(command);

  var config = ['-c', path.join(opts.rc || '', '.' + basename + 'rc')];
  debug('config', config);

  var extended = argify[basename](opts);
  debug('lint-specific', extended);

  return config
    .concat(extended)
    .concat(opts.targets);
};

/**
 * function jscs(opts)
 * Returns a fully formed arguments array for the
 * specified options for jscs.
 */
argify.jscs = function (opts) {
  return [
    opts.fix      && '--fix',
    opts.reporter && '--reporter=' + opts.reporter
  ].filter(Boolean);
};

/**
 * function eslint(opts)
 * Returns a fully formed arguments array for the
 * specified options for eslint.
 */
argify.eslint = function (opts) {
  return [
    //
    // TODO: Support opts.ext and opts.global
    //
    // eslint doesn't have a "--reporter" option, but has a "--format" option
    opts.format && '--format=' + opts.format
  ].filter(Boolean);
};

/**
 * function jshint(opts)
 * Returns a fully formed arguments array for the
 * specified options for jshint.
 */
argify.jshint = function (opts) {
  return [
    //
    // TODO: Support opts.ext and opts.global
    //
    opts.reporter && '--reporter=' + opts.reporter
  ].filter(Boolean);
};
