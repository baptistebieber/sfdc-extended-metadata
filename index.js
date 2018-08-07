/* global process, __dirname */
'use strict';
const gulpRetrieve = require('./lib/scripts/gulp-jsforce-retrieve.js')
const parseData = require('./lib/scripts/parse-data.js')

module.exports = {
  gulpRetrieve: gulpRetrieve,
  parseData: parseData
}