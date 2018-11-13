'use strict';
const fs = require('fs-extra');
const csv = require('csvtojson');
const xmlOptions = require('../utils/xml-options.js');
const saveFile = require('../utils/save-file.js');
const xmlbuilder = require('xmlbuilder'); 

const PLUGIN_NAME = 'import-data';

module.exports = (inputCSV, inputObject, inputNameEnv, outputData, options) => {
  if(typeof inputCSV === 'undefined' || inputCSV === null) {
    throw new Error('No CSV given');
  }
  if(typeof inputObject === 'undefined' || inputObject === null) {
    throw new Error('No object given');
  }
  if(!fs.existsSync(inputCSV)) {
    throw new Error('The file does not exist');
  }
  if(inputNameEnv == '') {
    inputNameEnv = 'all';
  }
  return new Promise((resolve, reject) => {
    csv()
    .fromFile(inputCSV)
    .then((res) => {
      res.forEach((row) => {
        let filename = outputData + '/objects/' + inputObject + '/' + inputNameEnv + '/' + row.Name + '.xml';
        let xmlContent = xmlbuilder.create(inputObject, { encoding: 'UTF-8' }).ele(row).end(xmlOptions);
        saveFile(filename, xmlContent, options);
      });
      resolve();
    })
    .catch((err) => {
      options.logger.log('Error '+PLUGIN_NAME+': '+err.message);
      reject();
    });
  });
};