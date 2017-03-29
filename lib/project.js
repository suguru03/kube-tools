'use strict';

const Aigle = require('aigle');
const exec = Aigle.promisify(require('child_process').exec);

exports.set = function({ project, zone, name }) {
  if (!project) {
    return Aigle.reject(new Error('Project not found'));
  }
  if (!zone) {
    return Aigle.reject(new Error('Zone not found'));
  }
  if (!name) {
    return Aigle.reject(new Error('Name not found'));
  }
  console.info(`project: ${project}, name: ${name}, zone: ${zone}`);
  return exec(`gcloud container clusters get-credentials ${name} --zone ${zone} --project ${project}`);
};
