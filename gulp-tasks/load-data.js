const path = require('path');
const fs = require('fs-extra');

const extendedMetadata = require('../');

const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-extended-metadata-' + scriptName;

module.exports = (gulp, plugins, options) => {
  return (cb) => {
    let listFiles = [
      'C:\\Users\\baptiste.bieber\\Documents\\Dev\\sfdc-extended-metadata\\src\\objects\\TestCS__c\\datas\\all\\1-tata.xml',
      'C:\\Users\\baptiste.bieber\\Documents\\Dev\\sfdc-extended-metadata\\src\\objects\\TestCS__c\\datas\\all\\1-toto.xml',
    ];
    extendedMetadata.loadData('TestCS__c', listFiles, 'upsert', options);
  };
};