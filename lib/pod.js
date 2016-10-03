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
      const list = _.transform(array, (result, items) => {
        if (items.length !== keys.length) {
          return;
        }
        const item = _.transform(keys, (result, key, index) => {
          result[key] = items[index];
        }, {});
        if (regExp.test(item.name)) {
          result.push(item);
        }
      });
      return list;
    });
};
