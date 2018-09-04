'use strict';
const child_process = require('child_process');

module.exports = (commitFrom, commitTo, repo, options) => {

  
  return new Promise((resolve, reject) => {
    // let fullResult = '';
    //   if(!config.from) {
    //     const firstCommitSHARaw = child_process.spawnSync('git', ['rev-list', '--max-parents=0', 'HEAD'],{
    //         "cwd": config.repo
    //       }).stdout;
    //     const firstCommitSHA = Buffer.from(firstCommitSHARaw);
    //     config.from = firstCommitSHA.toString('utf8').trim();
    //   }
    //   const child = child_process.spawn("git", ["diff", "--name-status", config.from, config.to], {
    //     "cwd": config.repo
    //   });
    //   child.stdout.on('data', function(data) {
    //     let buff = Buffer.from(data);
    //     fullResult += buff.toString('utf8');
    //   });
    //   child.on('close', function(code) {
    //     console.log(fullResult);
    //     // const lines = fullResult.split('\n');
    //   });
    //   child.stderr.on("data", function(data) {
    //     var buff = new Buffer(data);
    //     reject(buff.toString('utf8'));
    //   });
  });
};