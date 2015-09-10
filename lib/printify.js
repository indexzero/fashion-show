'use strict';

var chalk = require('chalk');

var isArg = /^-/;

/**
 * function printify (lint)
 * Displays the information about the lint being run
 */
module.exports = function printify(lint, options) {
  var rc = options.rc
    ? options.rc.split('/').slice(-2).join('/') + '/'
    : '';

  var lastArg;
  var args = lint.args
    .slice(0, lint.args.length - options.targets.length)
    .map(function (arg) {
      var match;
      if (lastArg === '-c' && (match = /\/(\..*)$/.exec(arg))) {
        arg = rc + match[1];
      }

      lastArg = arg;
      return isArg.test(arg)
        ? chalk.yellow(arg)
        : chalk.cyan(arg);
    }).join(' ');

  var targets = options.targets.map(function (path) {
    return path.replace(/\/\/$/, '/');
  }).join(' ');

  console.log('Running %s with options: %s %s', chalk.white.bold(lint.bin),
    args, chalk.magenta(targets));
};
