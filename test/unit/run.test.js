'use strict';

var path = require('path'),
    assume = require('assume'),
    proxyquire = require('proxyquire'),
    mocks = require('../mocks');

var run = proxyquire(path.join(__dirname, '..', '..', 'lib', 'run'), {
  child_process: mocks.childProcess()
});

describe('run (unit)', function () {
  it('should run eslint');
  it('should run jshint');
  it('should run jscs');
});
