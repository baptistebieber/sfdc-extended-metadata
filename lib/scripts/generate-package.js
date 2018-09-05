'use strict';

const listFilepaths = require('list-filepaths');

const generatePackageFromList = require('../utils/generate-package-from-list.js');

const PLUGIN_NAME = 'generate-package-from-list';
const PACKAGE_XML_FILE_NAME = 'package.xml';

module.exports = (inputFolder, outputFolder, options) => {
  if(typeof inputFolder === 'undefined' || inputFolder === null) {
    throw new Error('Not enough config options');
  }
  if(typeof outputFolder === 'undefined' || outputFolder === null) {
    throw new Error('Not enough config options');
  }

  return new Promise((resolve, reject) => {

    listFilepaths(inputFolder, {reject: /\-meta.xml$/})
    .then(filepaths => {
      generatePackageFromList(filepaths, inputFolder, outputFolder + '/' + PACKAGE_XML_FILE_NAME, options);
      resolve();
    })
    .catch(err => {
      options.logger.log('Error '+PLUGIN_NAME+': '+err.message);
      reject();
    });
  });
};