'use strict';

const Promise = require('bluebird');
const exec = Promise.promisify(require('child_process').exec);

exports.set = function({ project, zone, name }) {
	if (!project) {
		return Promise.reject(new Error('Project not found'));
	}
	if (!zone) {
		return Promise.reject(new Error('Zone not found'));
	}
	if (!name) {
		return Promise.reject(new Error('Name not found'));
	}
	console.info(`project: ${project}, name: ${name}, zone: ${zone}`);
	return exec(`gcloud container clusters get-credentials ${name} --zone ${zone} --project ${project}`);
};
