'use strict';
const gp = require('sfdc-generate-package');
const fs = require('fs');

module.exports = (inputFolder, outputFolder, options) => {
  if(typeof inputFolder === 'undefined' || inputFolder === null) {
    throw new Error('Not enough config options');
  }
  return gp({
    'src':inputFolder,
    'apiVersion': options.version,
    'output': outputFolder,
    'indent': options.indent
    }
  );
};