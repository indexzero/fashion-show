var os = require('os'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    async = require('async'),
    debug = require('diagnostics')('fashion-show');

var rootDir = path.join(__dirname),
    binDir  = path.join(rootDir, 'node_modules', '.bin');

var fashionShow = module.exports = function (options, callback) {
  var commands  = options.commands,
      targets   = options.targets,
      configDir = options.configDir;

  if (!commands) {
    commands = ['jshint', 'jscs'];
  }
  else if (!Array.isArray(commands)) {
    commands = [commands]
  }

  async.series(
    commands.map(function (command) {
      return async.apply(fashionShow.run, {
        command: command,
        args: ['--config', path.join(configDir, '.' + command + 'rc')],
        targets: targets
      });
    }),
    function (err, exits) {
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

/*
 * Runs the specified `command` in the local node_modules bin with the
 * `args` against the `targets` provided.
 *
 * @param {options} Options to run the specified command.
 * @param {command} String command to run
 * @param {args}    Array  Explicit arguments to pass to command
 * @param {targets} Array  List of (local) directory targets to run against.
 */
fashionShow.run = function (options, callback) {
  var command = options.command,
      args    = options.args,
      targets = options.targets || ['lib'];

  //
  // Map over the targets asynchronously to see if
  // there are any additional configuration files
  // that we should be adding.
  //
  async.map(
    [''].concat(targets),
    function extraConfig(dir, next) {
      //
      // Try to find the single config file.
      //
      fashionShow.findLocalConfig({
        command: command,
        dir: path.join(process.cwd(), dir)
      }, function (err, config) {
        return !err
          ? next(null, config)
          : next(err);
      });
    },
    function (err, extraConfigs) {
      if (err) { return callback(err); }

      //
      // Filter out any empty configs
      //
      extraConfigs = extraConfigs.filter(Boolean);

      var absolute = {
        //
        // Do not escape commands with absolute paths.
        //
        command: !/^\/[\w]+/.test(command)
          ? path.join(binDir, command)
          : command,
        //
        // Take any args, and concatenate with any additional
        // config files (with --config) and the targets
        //
        args: args
          .concat(extraConfigs.reduce(function (acc, file) {
            acc.push.apply(acc, ['--config', file]);
            return acc;
          }, []))
          .concat(targets),
        //
        // Run in `process.cwd()` to ensure that all relative
        // paths work.
        //
        options: { cwd: process.cwd() }
      };

      // If there's no file extension under Windows, look for a .bat or .cmd equivalent
      console.log(absolute.command);
      if (/^win/i.test(os.platform()) && !/[\\/][^\\/]*\.[^\\/]+$/.test(absolute.command)) {
        console.log('Has no extension');
        if (fs.existsSync(absolute.command + '.cmd')) {
          absolute.command += '.cmd';
        } else if (fs.existsSync(absolute.command + '.bat')) {
          absolute.command += '.bat';
        }
      }

      Object.keys(absolute).forEach(function (key) {
        debug(key, absolute[key]);
      });

      var child = spawn(absolute.command, absolute.args, absolute.options);
      console.log('Running %s against %s', command, targets.map(function (dir) {
        return (dir + '/').replace(/\/\/$/, '/');
      }).join(', '));

      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
      child.on('exit', function (code, signal) {
        callback(null, code, signal);
      });
    }
  );
};

/*
 * Checks to see if a local lint file exists for the `command`
 * exists in the specified `dir`.
 *
 * @param {options} Object Options to find the lint file.
 * @param {command} String Command to find lint file for.
 * @param {dir}     String Directory to find lint file in.
 */
fashionShow.findLocalConfig = function (options, callback) {
  var filename   = '.' + options.command + 'rc';
      isLintFile = new RegExp('\\' + filename + '$');

  fs.readdir(options.dir, function (err, files) {
    if (err) {
      return err.code !== 'ENOTDIR'
        ? callback(err)
        : callback();
    }

    var file = files.filter(function (file) {
      return isLintFile.test(file);
    })[0];

    if (file) {
      debug('Found %s in %s', filename, options.dir);
      file = path.join(options.dir, file);
    }

    callback(null, file);
  });
};
