'use strict';

const generatePackageFromList = require('../utils/generate-package-from-list.js');

const PLUGIN_NAME = 'generate-package-from-list';

module.exports = (filepaths, inputFolder, outputFile, options) => {
  if(typeof inputFolder === 'undefined' || inputFolder === null) {
    throw new Error('Not enough config options');
  }

  return new Promise((resolve, reject) => {
    try {
      generatePackageFromList(filepaths, inputFolder, outputFile, options);
      resolve();
    }
    catch(err) {
      options.logger.log('Error '+PLUGIN_NAME+': '+err.message);
      reject();
    }
  });
};