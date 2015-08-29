var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    debug = require('diagnostics')('fashion-show'),
    defaultify = require('./lib/defaultify'),
    run = require('./lib/run');

var rootDir = path.join(__dirname);

var fashionShow = module.exports = function (defaults, callback) {
  var options = defaultify(defaults),
      commands = options.commands;

  debug('env.$PATH', process.env.PATH);
  async.parallel(
    commands.map(function (command) {
      debug('run.invoke { command: %s }', command);
      return async.apply(run, command, options);
    }),
    function (err, exits) {
      debug('run.finish { err: %s, exits: %j }', err, exits);

      if (err) {
        console.dir(err);
        return callback(err);
      }

      var code = 0;
      exits.forEach(function (args) {
        var exit   = args[0],
            signal = args[1];

        //
        // Set the "meta" error code to the first
        // unsuccessful error code returned by `jscs`
        // OR `jshint`.
        //
        if (!code) {
          if (exit) { code = exit; }
          else if (signal) {
            code = 1;
          }
        }
      });

      callback(null, code);
    }
  );
};
