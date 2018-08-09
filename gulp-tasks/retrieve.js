const path = require('path');

const extendedMetadata = require('../');

const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-extended-metadata-' + scriptName;
const RETRIEVE_RESULT_FILE = './retrieveResult.json';

module.exports = (gulp, plugins, options) => {
  return cb => {
    let status = null;
    let packageXml = options.arg.p || options.arg.package || options.src + '/package.xml';
    options.logger.log('Package used' + packageXml);
    gulp.src(packageXml)
    .pipe(extendedMetadata.gulpRetrieve(packageXml, options.tmp, options).on('error', error => {
      status = error;
    }))
    .pipe(plugins.rename(RETRIEVE_RESULT_FILE))
    .pipe(gulp.dest('.'));
    if(status) {
      options.logger.error(status);
    }
  }
}