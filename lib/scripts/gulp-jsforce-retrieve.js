'use strict';
const meta = require('jsforce-metadata-tools');
const through = require('through2');
const gutil = require('gulp-util');
const extractZipContents = require('./extend-jsforce-metadata-tools.js')

module.exports = (packageXmlPath, folderToExtract, options) => {
  return through.obj((file, enc, callback) => {
    let err;
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new gutil.PluginError(PLUGIN_NAME, 'Stream input is not supported'));
    }
    options.logger = gutil;
    meta.retrieveByPackageXML(packageXmlPath, options)
    .then(res => {
      meta.reportRetrieveResult(res, gutil, options.verbose);
      if (!res.success) {
        return callback(new gutil.PluginError(PLUGIN_NAME, 'Retrieve failed'),file);
      }
      extractZipContents(res.zipFile, folderToExtract, gutil, options.verbose)
      delete res.zipFile;
      file.contents = new Buffer.from(JSON.stringify(res));
      callback(null, file);
    })
    .catch(err => {
      gutil.log(PLUGIN_NAME,err.message)
      callback(err);
    });
  });
};