'use strict';

const requireDir = require('require-dir');

module.exports = requireDir('./lib', { recurse: true });
