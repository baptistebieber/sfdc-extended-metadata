'use strict';
const meta = require('jsforce-metadata-tools');
const through = require('through2');
const extractZipContents = require('./extend-jsforce-metadata-tools.js')
const MyLogger = require('../utils/my-logger');
const pluginError = require('plugin-error');

module.exports = (packageXmlPath, folderToExtract, options) => {
  return through.obj((file, enc, callback) => {
    let err;
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new pluginError(PLUGIN_NAME, 'Stream input is not supported'));
    }
    options.logger = new MyLogger();
    meta.retrieveByPackageXML(packageXmlPath, options)
    .then(res => {
      meta.reportRetrieveResult(res, options.logger, options.verbose);
      if (!res.success) {
        return callback(new pluginError(PLUGIN_NAME, 'Retrieve failed'),file);
      }
      extractZipContents(res.zipFile, folderToExtract, options.logger, options.verbose)
      delete res.zipFile;
      file.contents = new Buffer.from(JSON.stringify(res));
      callback(null, file);
    })
    .catch(err => {
      console.log('Error : '+err.message);
      logger.error(PLUGIN_NAME,err.message)
      callback(err);
    });
  });
};