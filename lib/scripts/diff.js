'use strict';
const childProcess = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const generatePackage = require('./generate-package.js');
const composeData = require('./compose-data.js');

const PLUGIN_NAME = 'diff';

module.exports = (commitFrom, commitTo, repo, inputFolder, outputFolder, options) => {

  options['apiVersion'] = options.apiVersion || options.version
  return new Promise((resolve, reject) => {
    let fullResult = '';
      if(!commitFrom) {
        const firstCommitSHARaw = childProcess.spawnSync('git', ['rev-list', '--max-parents=0', 'HEAD'],{
            "cwd": repo
          }).stdout;
        const firstCommitSHA = Buffer.from(firstCommitSHARaw);
        commitFrom = firstCommitSHA.toString('utf8').trim();
      }
      const child = childProcess.spawn("git", ["diff", "--name-status", commitTo, commitFrom], {
        "cwd": repo
      });
      child.stdout.on('data', function(data) {
        let buff = Buffer.from(data);
        fullResult += buff.toString('utf8');
      });
      child.on('close', function(code) {
        let delFolder = outputFolder + '-del';
        let destructiveChangesPre = [];
        fullResult.split('\n').filter(line => line.length > 0).forEach(line => {

          let [motif, filePath] = line.replace(/\s+/g,',').split(',')
          filePath = repo + '/' + filePath;
          let relativePath = path.relative(inputFolder, filePath);
          if(motif === 'D') {
            // TODO: destructiveChangesPre.xml
            // fs.copySync(filePath, delFolder + '/' + relativePath);
          }
          else {
            fs.copySync(filePath, delFolder + '/' + relativePath);
          }
        });

        Promise.all([composeData(delFolder, outputFolder, options)])
        .then(res => {
          Promise.all([generatePackage(outputFolder, outputFolder, options)])
          .then(res => {
            resolve();
          })
        })
      });
      child.stderr.on("data", function(data) {
        var buff = new Buffer(data);
        reject(buff.toString('utf8'));
      });
  });
};