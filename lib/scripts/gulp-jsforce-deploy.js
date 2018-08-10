'use strict';
const meta = require('jsforce-metadata-tools');
const pluginError = require('plugin-error');
const through = require('through2');

const PLUGIN_NAME = 'gulp-jsforce-deploy';

module.exports = options => {
  return through.obj((file, enc, callback) => {
    let err;
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new pluginError(PLUGIN_NAME, 'Stream input is not supported'));
    }
    meta.deployFromZipStream(file.contents, options)
    .then(res => {
      meta.reportDeployResult(res, options.logger, options.verbose);
      if (!res.success) {
        return callback(new pluginError(PLUGIN_NAME, 'Deploy failed'),file);
      }
      file.contents = new Buffer.from(JSON.stringify(res));
      callback(null, file);
    })
    .catch(err => {
      options.logger.log('Error : '+err.message);
      options.logger.error(PLUGIN_NAME,err.message)
      callback(err);
    });
  });
};