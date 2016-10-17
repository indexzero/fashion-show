'use strict';

var spawn = require('child_process').spawn,
    debug = require('diagnostics'),
    argify = require('./argify'),
    envify = require('./envify'),
    printify = require('./printify');

/*
 * Runs the specified `command` in the local node_modules bin with the
 * `args` against the `targets` provided.
 *
 * @param {options} Options to run the specified command.
 * @param {command} String command to run
 * @param {args}    Array  Explicit arguments to pass to command
 * @param {targets} Array  List of (local) directory targets to run against.
 */
module.exports = function run(command, options, callback) {
  var lint = {
    //
    // Remark: how will be expose commands with relative?
    // Will we assume that `npm run` will suffice?
    //
    bin: command,
    //
    // Create the arguments for this specific command
    //
    args: argify(command, options),
    //
    // Run in `process.cwd()` to ensure that all relative
    // paths work.
    //
    options: { cwd: options.cwd }
  };

  debug('fashion-show:run:lint.bin')(lint.bin);
  debug('fashion-show:run:lint.args')('%j', lint.args);
  debug('fashion-show:run:lint.options')('%j', lint.options);

  //
  // Set the environment variables of the lint binary to run.
  // n.b. we prepend the `binPath` from `envify` defaulting to
  // the node_modules/.bin directory relative to `options.rc`.
  //
  lint.options.env = envify(options);

  // Run the .CMD executible on Windows.
  if (/^win/.test(process.platform)) {
    lint.bin = lint.bin + '.CMD';
  }

  var child = spawn(lint.bin, lint.args, lint.options);
  printify(lint, options);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  child.on('exit', function (code, signal) {
    var namespace = 'fashion-show:run:exit:' + command;
    debug(namespace)('code', code);
    debug(namespace)('code', signal);
    callback(null, code, signal);
  });
};
