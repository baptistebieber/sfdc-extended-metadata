const path = require('path');

const extendedMetadata = require('../');

const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-extended-metadata-' + scriptName;

module.exports = (gulp, plugins, options) => {
  return (cb) => {
    extendedMetadata.importData('./data-session.csv', 'TestCS__c', 'all', options.dataFolder, options);
  };
};