'use strict';
const gulp = require('gulp');
var gulpSequence = require('gulp-sequence')
const fs = require('fs-extra');
const path = require('path');

const options = require('./lib/utils/options-builder');
const getTask = require('./lib/utils/get-tasks');
const parseArgv = require('./lib/utils/parse-argv');
const plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-jsforce-exec-anon': 'execAnon'
  }
});
const MyLogger = require('./lib/utils/my-logger');
options.logger = new MyLogger();
options.root = __dirname;
options.arg = parseArgv(process.argv);

const TASK_PATH = './gulp-tasks/'
const SEQUENCES_PATH = './gulp-sequences/'

fs.readdirSync(TASK_PATH).forEach(file => {
  const task = path.basename(file, path.extname(file));
  gulp.task(task, getTask([task,gulp,plugins,options]));
});

fs.readdirSync(SEQUENCES_PATH).forEach(file => {
  const sequence = path.basename(file, path.extname(file));
  let listTask = require(SEQUENCES_PATH + sequence);
  gulp.task(sequence, gulpSequence(...listTask));
});

