/* global process, __dirname */
'use strict';
const decompress = require('decompress');

module.exports = (zipFileContent, dirMapping, logger, verbose) => {
  logger.log('');
  const zipBuffer = Buffer.from(zipFileContent, 'base64');
  return decompress(zipBuffer, dirMapping);
}