'use strict';
const fs = require('fs-extra');
const meta = require('jsforce-metadata-tools');
const PluginError = require('plugin-error');
const through = require('through2');

const extractZipContents = require('../utils/extend-jsforce-metadata-tools.js');
const sanitizePackage = require('../utils/sanitize-package.js');

const PLUGIN_NAME = 'gulp-jsforce-retrieve';

module.exports = (packageXmlPath, folderToExtract, options) => {
  return through.obj((file, enc, callback) => {
    let err;
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Stream input is not supported'));
    }
    options.logger.log('Package used: ' + packageXmlPath);
    fs.removeSync(folderToExtract);

    sanitizePackage(packageXmlPath, folderToExtract, options)
    .then(packageSanitizedPath => {
      meta.retrieveByPackageXML(packageSanitizedPath, options)
      .then(res => {
        meta.reportRetrieveResult(res, options.logger, options.verbose);
        if (!res.success) {
          return callback(new PluginError(PLUGIN_NAME, 'Retrieve failed'),file);
        }
        extractZipContents(res.zipFile, folderToExtract, options.logger, options.verbose);
        delete res.zipFile;
        file.contents = new Buffer.from(JSON.stringify(res));
        callback(null, file);
      })
      .catch((err) => {
        options.logger.log('Error '+PLUGIN_NAME+': '+err.message);
        callback(err);
      });
    })
    .catch((err) => {
      options.logger.log('Error '+PLUGIN_NAME+': '+err.message);
      callback(err);
    });
  });
};