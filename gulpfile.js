'use strict';
const gulp = require('gulp');
const fs = require('fs-extra');
const path = require('path');

const options = require('./lib/utils/options-builder');
const getTask = require('./lib/utils/get-tasks');
const plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-jsforce-exec-anon': 'execAnon'
  }
});
const MyLogger = require('./lib/utils/my-logger');
options.logger = new MyLogger();

const TASK_PATH = './gulp-tasks/'

fs.readdirSync(TASK_PATH).forEach(file => {
  const task = path.basename(file, path.extname(file));
  gulp.task(task, getTask([task,gulp,plugins,options]));
});

