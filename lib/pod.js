'use strict';

const _ = require('lodash');
const Aigle = require('aigle');
const inquirer = require('inquirer');
const exec = Aigle.promisify(require('child_process').exec);
const prompt = inquirer.createPromptModule();

exports.get = function(podname) {

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
        .filter(pod => regExp.test(pod.name))
        .value();
      return list;
    });
};

exports.delete = function(podname) {

  if (!podname) {
    console.warn('looking into all pods...');
  }

  let pods;
  return this.get(podname)
    .then(_pods => {
      pods = _pods;
      if (_.isEmpty(pods)) {
        return Aigle.reject(new Error('Pod not found'));
      }
      console.log('pod list:');
      _.forEach(pods, pod => console.log(`\t[${[pod.name]}]`));
      return prompt({
        name: 'confirm',
        type: 'confirm',
        message: 'Do you want to delete the pods?'
      });
    })
    .then(({ confirm }) => {
      if (!confirm) {
        return Aigle.reject(new Error('Confirmation failed'));
      }
      if (podname) {
        return { confirm: true };
      }
      return prompt({
        name: 'confirm',
        type: 'confirm',
        message: 'Are you sure?'
      });
    })
    .then(({ confirm }) => {
      if (!confirm) {
        return Aigle.reject(new Error('Confirmation failed'));
      }
      return Aigle.map(pods, pod => exec(`kubectl delete pod ${pod.name}`));
    })
    .then(() => console.log('deleted'));
};
