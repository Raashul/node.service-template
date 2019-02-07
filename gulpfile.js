'use strict';

const gulp = require('gulp');
const nodemon = require('nodemon');
const mocha = require('gulp-mocha');
const glog = require('gulp-util');

gulp.task('mocha', () =>
	gulp.src(['tests/mocha/**/*.js'], {read: false})
		.pipe(mocha({reporter: 'nyan'}))
);

gulp.task('nodemon', () => {
  nodemon({
    script: 'server.js',
    exec: 'node -r dotenv/config server.js',
    ignore: ['tests/*'],
    tasks: ['linting']
  })
  .on('restart', () => {
    glog.log('Nodemon restarted.');
  })
});

gulp.task('test', ['mocha']);
gulp.task('start', ['nodemon']);
gulp.task('default', ['nodemon']);
