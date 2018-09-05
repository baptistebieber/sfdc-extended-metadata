'use strict';
const meta = require('jsforce-metadata-tools');
const pluginError = require('plugin-error');
const path = require('path');
let fs = require('fs-extra');
var archiver = require('archiver');

const PLUGIN_NAME = 'deploy';

module.exports = (packageSrc, options) => {
  if(typeof packageSrc === 'undefined' || packageSrc === null) {
    throw new Error('Not enough config options');
  }
  if(!fs.existsSync(packageSrc)) {
    throw new Error('The folder does not exist');
  }
  return new Promise((resolve, reject) => {
    var archive = archiver('zip');
    archive.glob('**', { cwd: packageSrc });
    archive.finalize();
    meta.deployFromZipStream(archive, options)
    .then((res) => {
      meta.reportDeployResult(res, options.logger, options.verbose);
      if (!res.success) {
        throw new Error(res.errorMessage);
      }
      resolve();
    })
    .catch((err) => {
      options.logger.log('Error '+PLUGIN_NAME+': '+err.message);
      reject();
    });
  });
};