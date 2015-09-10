'use strict';

var path = require('path'),
    assume = require('assume'),
    stdMocks = require('std-mocks'),
    stripAnsi = require('strip-ansi'),
    fashionShow = require('../index');

var rootDir = path.join(__dirname, '..');

/**
 * Returns a function which runs the specified
 * linter `commands` and asserts a particular
 * output from `fashion-show`.
 */
function assumeLinterRuns(commands, expected) {
  expected = expected || {};
  expected.stdout = expected.stdout || [expectedOutput(commands)];

  return function (done) {
    stdMocks.use();

    fashionShow({
      commands: commands,
      rc: path.join('.', 'test', 'fixtures'),
      targets: ['lib'],
      cwd: rootDir
    }, function (err, code) {
      stdMocks.restore();

      var output = stdMocks.flush();
      output.stdout = output.stdout
        .map(function (line) {
          return stripAnsi('' + line).trim();
        });

      if (err || code || output.stdout.length !== expected.stdout.length) {
        ['stdout', 'stderr'].forEach(function (pipe) {
          console.log(output[pipe].join('\n'));
        });
      }

      assume(err).equals(null);
      assume(code).equals(0);

      assume(output.stdout.length).gte(expected.stdout.length);
      assume(output.stdout[0]).equals(expected.stdout[0]);
      done();
    });
  };
}

/**
 * Returns the expected output for a specified linter
 */
function expectedOutput(linter) {
  return [
    'Running ' + linter + ' with options:',
    '-c test/fixtures/.' + linter + 'rc',
    'lib'
  ].join(' ');
}

describe('fashion-show (integration)', function () {
  it('should run eslint correctly', assumeLinterRuns('eslint'));
  it('should run jshint correctly', assumeLinterRuns('jshint'));
  it('should run jscs correctly', assumeLinterRuns('jscs'));
});
