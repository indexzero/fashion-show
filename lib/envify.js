'use strict';

var assign = require('object-assign');
var delimiter = require('path').delimiter;

/**
 * Returns process.env with `options.binPath` prepended
 * to the $PATH to ensure that the corrent lint binaries
 * are used by `fashion-show`.
 */
module.exports = function (options) {
  var env = assign({}, process.env, options.env);
  env.PATH = options.binPath + delimiter + env.PATH;
  return env;
};
