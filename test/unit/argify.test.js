'use strict';

var assume = require('assume'),
    argify = require('../../lib/argify');

/**
 * Exports a test suite assets that common (i.e. shared)
 * options for linters.
 *
 * @param {String} command Name of the linter to run
 */
function assumeSharedOptions(command) {
  return function () {
    it('{ reporter }', function () {
      var mixin = argify[command]({ reporter: 'spec' });
      assume(mixin).deep.equals(['--reporter=spec']);
    });

    it ('{} (no args)', function () {
      var mixin = argify[command]({});
      assume(mixin).deep.equals([]);
    });
  };
}

/*
 * Returns a function with no arguments
 * that invokes argify the `command` and `opts`
 * provided.
 */
function invokeify(command, opts) {
  return function () {
    argify(command, opts);
  };
}

describe('argify (unit)', function () {
  describe('argify(command, opts)', function () {
    it('jscs { rc, fix, reporter, targets }', function () {
      var args = argify('jscs', {
        rc: '/path/to/rcfile',
        fix: true,
        reporter: 'spec',
        targets: ['lib/', 'test/*.js']
      });

      assume(args).deep.equal([
        '-c', '/path/to/rcfile/.jscsrc',
        '--fix',
        '--reporter=spec',
        'lib/', 'test/*.js'
      ]);
    });

    it('eslint { rc, reporter, targets }', function () {
      var args = argify('eslint', {
        rc: '/path/to/rcfile',
        reporter: 'spec',
        targets: ['lib/', 'test/*.js']
      });

      assume(args).deep.equal([
        '-c', '/path/to/rcfile/.eslintrc',
        '--format=spec',
        'lib/', 'test/*.js'
      ]);

      it('{ reporter }', function () {
        var mixin = argify[command]({ reporter: 'spec' });
        assume(mixin).deep.equals(['--format=spec']);
      });

      it('{ format }', function () {
        var mixin = argify[command]({ format: 'spec' });
        assume(mixin).deep.equals(['--format=spec']);
      });


      it ('{} (no args)', function () {
        var mixin = argify[command]({});
        assume(mixin).deep.equals([]);
      });

    });

    it('jshint { rc, reporter, targets }', function () {
      var args = argify('jshint', {
        rc: '/path/to/rcfile',
        reporter: 'spec',
        targets: ['lib/', 'test/*.js']
      });

      assume(args).deep.equal([
        '-c', '/path/to/rcfile/.jshintrc',
        '--reporter=spec',
        'lib/', 'test/*.js'
      ]);
    });

    it('throws with no opts or opts.targets', function () {
      var msg = 'opts and opts.targets are required';

      assume(invokeify('jscs')).throws(msg);
      assume(invokeify('eslint', {})).throws(msg);
      assume(invokeify('jshint', { targets: [] })).throws(msg);
    });
  });

  describe('jscs', function () {
    it('{ reporter, fix }', function () {
      var mixin = argify.jscs({ fix: true, reporter: 'spec' });
      assume(mixin).deep.equals(['--fix', '--reporter=spec']);
    });

    it('{ fix }', function () {
      var mixin = argify.jscs({ fix: true });
      assume(mixin).deep.equals(['--fix']);
    });
  });

  describe('shared options', function () {
    describe('jscs', assumeSharedOptions('jscs'));
    describe('jshint', assumeSharedOptions('jshint'));
  });
});
