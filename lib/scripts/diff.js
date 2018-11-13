'use strict';
const childProcess = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const generatePackageFromList = require('./generate-package-from-list.js');
const composeData = require('./compose-data.js');

const PLUGIN_NAME = 'diff';

module.exports = (commitFrom, commitTo, repo, inputFolder, outputFolder, options) => {

  if(typeof commitFrom === 'undefined' || commitFrom == null) {
    throw new Error('Not enough config options : commitFrom');
  }
  if(typeof commitTo === 'undefined' || commitTo == null) {
    throw new Error('Not enough config options : commitTo');
  }
  
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
      
      fs.removeSync(outputFolder);
      fs.removeSync(delFolder);

      const diffs = {
        'package.xml' : [],
        'destructiveChangesPre.xml' : []
      };
      fullResult.split('\n').filter(line => line.length > 0).forEach(line => {

        let [motif, filePath] = line.replace(/\t/g,',').split(',');

        if(options.verbose) {
          options.logger.log(motif+ "\t" + filePath);
        }

        filePath = repo + '/' + filePath;
        let relativePath = path.relative(inputFolder, filePath);
        if(relativePath.substr(0,2) !== '..' && relativePath.match(/-meta\.xml$/) === null) {
          if(motif === 'D') {
            diffs['destructiveChangesPre.xml'].push(filePath);
          }
          else {
            diffs['package.xml'].push(filePath);
            fs.copySync(filePath, delFolder + '/' + relativePath);
            fs.copySync(filePath + '-meta.xml', delFolder + '/' + relativePath + '-meta.xml');
          }
        }
      });

      Promise.all([
        composeData(delFolder, outputFolder, options), 
        generatePackageFromList(diffs['package.xml'], inputFolder, outputFolder + '/package.xml', options),
        generatePackageFromList(diffs['destructiveChangesPre.xml'], inputFolder, outputFolder + '/destructiveChangesPre.xml', options)
      ])
      .then(res => {
        fs.removeSync(delFolder);
        resolve();
      })
    });
    child.stderr.on("data", function(data) {
      var buff = new Buffer(data);
      reject(buff.toString('utf8'));
    });
  });
};