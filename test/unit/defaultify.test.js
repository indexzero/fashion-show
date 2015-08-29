'use strict';

var assume = require('assume'),
    defaultify = require('../../lib/defaultify');

describe('defaultify (unit)', function () {
  it('should have expected defaults', function () {
    var defaults = defaultify();
    assume(defaults.commands).deep.equals(['jscs', 'eslint']);
    assume(defaults.targets).deep.equals(['test/unit/defaultify.test.js']);
    assume(defaults.rc).equals(undefined);
    assume(defaults.fix).equals(undefined);
    assume(defaults.reporter).equals(undefined);
    assume(defaults.global).equals(undefined);
    assume(defaults.exts).deep.equals(['.js']);
  });

  it('--rc');
  it('--fix');
  it('--reporter');
  it('--global');
  it('--command (one)');
  it('--command (multiple)');
  it('--ext (one)');
  it('--ext (multiple)');
  it('argv._ (one)');
  it('argv._ (multiple)');

  it('{ commands }');
  it('{ targets }');
  it('{ rc }');
  it('{ fix }');
  it('{ reporter }');
  it('{ global }');
  it('{ exts }');
});
