/* global process, __dirname */
'use strict';
const gulp = require('gulp');
const retrieve = require('./');
const options = require('./lib/utils/options-builder');
const plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-jsforce-exec-anon': 'execAnon'
  }
});
const MyLogger = require('./lib/utils/my-logger');

const RETRIEVE_RESULT_FILE = './retrieveResult.json';

gulp.task('retrieve', function() {
  let logger = new MyLogger();
  let status = null;
  gulp.src(options.src + '/package.xml')
  .pipe(retrieve.gulpRetrieve(options.src + '/package.xml', options.tmp, options).on('error', error => {
    status = error;
  }))
  .pipe(plugins.rename(RETRIEVE_RESULT_FILE))
  .pipe(gulp.dest('.'));
  if(status) {
    logger.error(status);
  }
});

gulp.task('parse-data', function() {
  retrieve.parseData(options.tmp, options.src, options);
  // return Promise.all([retrieve.parseData(options.tmp, options.src, options)])
  // .then(result => {
  //   console.log('ok');
  // });
});