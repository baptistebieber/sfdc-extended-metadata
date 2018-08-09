const path = require('path');

const extendedMetadata = require('../');

const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-extended-metadata-' + scriptName;
const DEPLOY_RESULT_FILE = './deployResult.json';

module.exports = (gulp, plugins, options) => {
  return cb => {
    let status = null;
    gulp.src(options.tmp+'/**')
    .pipe(plugins.zip('pkg.zip'))
    .pipe(extendedMetadata.gulpDeploy(options).on('error', function(error) {
      status = error;
    }))
    .pipe(plugins.rename(DEPLOY_RESULT_FILE))
    .pipe(gulp.dest('.'));
    if(status) {
      options.logger.error(status);
    }
  }
};