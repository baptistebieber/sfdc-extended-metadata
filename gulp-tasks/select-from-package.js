const path = require('path');

const extendedMetadata = require('../');


const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-extended-metadata-' + scriptName;
const RETRIEVE_RESULT_FILE = './retrieveResult.json';

module.exports = (gulp, plugins, options) => {
  return (cb) => {
    let packageXml = options.arg.p || options.arg.package || options.src + '/package.xml';
    extendedMetadata.selectFromPackage(packageXml, options.src, options.tmp, options);
  };
}