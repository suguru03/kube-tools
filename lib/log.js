'use strict';

const { spawn } = require('child_process');

const _ = require('lodash');

const pod = require('./pod');

module.exports = function(opts) {

  opts = opts || {};
  const podname = opts.p || opts.pod;
  const container = opts.c || opts.container || '';
  const args = ['logs'].concat(opts.args);

  function execLogger(list) {
    _.forEach(list, item => {
      console.log(`[${item.name}] ${subname ? subname : ''}`);
      const logger = spawn('kubectl', args.concat(item.name, subname))
        .on('error', err => console.error(err))
        .on('close', err => console.log('close', err));
      logger.stdout.on('data', data => process.stdout.write(data));
      logger.stderr.on('data', data => process.stderr.write(data));
    });
  }
  return pod.get(podname)
    .then(execLogger);
};
