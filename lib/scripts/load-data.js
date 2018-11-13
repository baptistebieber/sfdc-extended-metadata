'use strict';
const fs = require('fs-extra');
const csv = require('csvtojson');
const xmlOptions = require('../utils/xml-options.js');
const saveFile = require('../utils/save-file.js');
const xmlbuilder = require('xmlbuilder');
const jsforce = require('jsforce');

const PLUGIN_NAME = 'load-data';

module.exports = (inputObject, inputListFiles, inputMode, options) => {
  if(typeof inputObject === 'undefined' || inputObject === null) {
    throw new Error('No object given');
  }
  return new Promise((resolve, reject) => {

    const conn = new jsforce.Connection({
      loginUrl : options.loginUrl
    });

    conn.login(options.username, options.password, (err, userInfo) => {
      if (err) {
        options.logger.log('Error '+PLUGIN_NAME+': ' + err);
        reject();
      }
      conn.bulk.load(inputObject, inputMode, inputNameEnv, file, (error, rets) => {
        if (error) { return callback(new gutil.PluginError(PLUGIN_NAME + ' ' + mode,error)); }
        for (let res of rets) {
          if (res.success) {
            gutil.log(PLUGIN_NAME + ' ' + mode, res.id + ' loaded successfully')
          } 
          else {
            gutil.log(PLUGIN_NAME + ' ' + mode, res.id + ' error occurred, message = ' + res.errors.join(', '))
          }
        }
      });
    });

    csv()
    .fromFile(inputCSV)
    .then((res) => {
      res.forEach((row) => {
        let filename = outputSrc + '/objects/' + inputObject + '/datas/' + inputNameEnv + '/' + row.Name + '.xml';
        let xmlContent = xmlbuilder.create(inputObject, { encoding: 'UTF-8' }).ele(row).end(xmlOptions);
        saveFile(filename, xmlContent, options);
      });
      resolve();
    })
    .catch((err) => {
      options.logger.log('Error '+PLUGIN_NAME+': '+err.message);
      reject();
    });
  });
};