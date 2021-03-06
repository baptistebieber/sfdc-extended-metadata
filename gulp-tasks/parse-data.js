const path = require('path');

const extendedMetadata = require('../');

const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-extended-metadata-' + scriptName;

module.exports = (gulp, plugins, options) => {
  return (cb) => {
    extendedMetadata.parseData(options.tmp, options.src, options);
  };
};