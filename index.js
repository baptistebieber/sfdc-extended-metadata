/* global process, __dirname */
'use strict';
const deploy = require('./lib/scripts/deploy.js');
const retrieve = require('./lib/scripts/retrieve.js');
const gulpRetrieve = require('./lib/scripts/gulp-jsforce-retrieve.js');
const gulpDeploy = require('./lib/scripts/gulp-jsforce-deploy.js');
const parseData = require('./lib/scripts/parse-data.js');
const composeData = require('./lib/scripts/compose-data.js');
const generatePackage = require('./lib/scripts/generate-package.js');

module.exports = {
  deploy: deploy,
  retrieve: retrieve,
  gulpRetrieve: gulpRetrieve,
  gulpDeploy: gulpDeploy,
  parseData: parseData,
  composeData: composeData,
  generatePackage: generatePackage,
}