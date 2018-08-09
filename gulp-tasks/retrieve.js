const path = require('path');

const extendedMetadata = require('../');

const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-extended-metadata-' + scriptName;
const RETRIEVE_RESULT_FILE = './retrieveResult.json';

module.exports = (gulp, plugins, options) => {
  return cb => {
    let status = null;
    gulp.src(options.src + '/package.xml')
    .pipe(extendedMetadata.gulpRetrieve(options.src + '/package.xml', options.tmp, options).on('error', error => {
      status = error;
    }))
    .pipe(plugins.rename(RETRIEVE_RESULT_FILE))
    .pipe(gulp.dest('.'));
    if(status) {
      options.logger.error(status);
    }
  }
}