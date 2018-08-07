'use strict';

const logger = require('fancy-log');

module.exports = class MyLogger {
  log(msg) {
    logger(msg);
  }
  error(msg) {
    logger.error(msg);
  }
  warn(msg) {
    logger.warn(msg);
  }
  info(msg) {
    logger.info(msg);
  }
  dir(msg) {
    logger.dir(msg);
  }
}