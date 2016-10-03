'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const exec = Promise.promisify(require('child_process').exec);

module.exports = function(podname) {

  const regExp = new RegExp(podname ? `^${podname}` : '');

  return exec('kubectl get pod')
    .then(stdout => {
      if (!stdout) {
        console.error('pod not found');
        process.exit(1);
      }
      const array = _.map(stdout.split(/\n/), str => _.compact(str.split(/ /)));
      const keys = _.map(array.shift(), _.toLower);
      const list = _.chain(array)
        .reject(arr => arr.length !== keys.length)
        .map(arr => _.transform(keys, (result, key, index) => result[key] = arr[index], {}))
        .filter(item => regExp.test(item.name))
        .value();
      return list;
    });
};
