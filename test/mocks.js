'use strict';

var EventEmitter = require('events').EventEmitter,
    stream = require('stream'),
    util = require('util');

/**
 * function childProcess
 * A proper, simple mock for `child_process` when
 * using `proxyquire`.
 */
exports.childProcess = function (defaults) {
  defaults = defaults || {};
  return {
    spawn: function spawn(script, opts) {
      return new ChildProc(script, opts, defaults);
    }
  };
};

/**
 * function Child(script, opts)
 * A proper, simple mock for a child process when
 * using `proxyquire`.
 */
function ChildProc(script, opts, defaults) {
  EventEmitter.call(this);
  this.script = script;
  this.options = opts;
  this.stdout = new stream.Stream();
  this.stderr = new stream.Stream();

  setImmediate(this.emit, 'exit', 0, null);
}

util.inherits(ChildProc, EventEmitter);
