const fs = require('fs-extra');
const path = require('path');

module.exports = (fileName, xmlContent, options) => {
  fs.outputFileSync(fileName, xmlContent);
  if(options.verbose) options.logger.log('Create file ' + path.normalize(fileName).replace(/\\/g, '/'));
};